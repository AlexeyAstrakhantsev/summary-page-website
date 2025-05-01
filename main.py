from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import httpx
from sqlmodel import SQLModel, Session, select, create_engine
from src.models import User, UserLimit


DATABASE_URL = os.environ.get("DATABASE_URL")
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"
PORT = int(os.environ.get("PORT", 4000))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./test.db")
engine = create_engine(DATABASE_URL, echo=True)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


class UserInfo(BaseModel):
    id: str
    email: str
    name: Optional[str]
    isPremium: bool
    createdAt: Optional[str]
    lastLogin: Optional[str]
    usageLimit: Optional[int] = None
    usageCount: Optional[int] = None

def get_google_userinfo(token: str):
    headers = {"Authorization": f"Bearer {token}"}
    try:
        resp = httpx.get(GOOGLE_USERINFO_URL, headers=headers)
        resp.raise_for_status()
        return resp.json()
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")





@app.get("/api/user-info", response_model=UserInfo)
async def user_info(token: Optional[str] = Query(None), userId: Optional[str] = Query(None)):
    if token:
        info = get_google_userinfo(token)
        user_id = info["sub"]
    elif userId:
        user_id = userId
    else:
        raise HTTPException(status_code=400, detail="No user identification provided")

    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return UserInfo(
            id=user.id,
            email=user.email,
            name=user.name,
            isPremium=user.is_premium,
            createdAt=str(user.created_at) if user.created_at else None,
            lastLogin=str(user.last_login) if user.last_login else None,
        )

from openrouter import generate_summary, AVAILABLE_MODELS, DETAIL_LEVELS, DEFAULT_MODEL
from datetime import datetime, timezone
from fastapi import Body
from typing import List
import pytz

UNAUTH_LIMIT = int(os.environ.get("UNAUTH_LIMIT", 3))
AUTH_LIMIT = int(os.environ.get("AUTH_LIMIT", 10))
PREMIUM_LIMIT = os.environ.get("PREMIUM_LIMIT")
if PREMIUM_LIMIT is None or PREMIUM_LIMIT == 'null':
    PREMIUM_LIMIT = None
else:
    PREMIUM_LIMIT = int(PREMIUM_LIMIT)

class SummaryRequest(BaseModel):
    text: str
    model: Optional[str] = None
    detailLevel: Optional[str] = None
    token: Optional[str] = None
    userId: Optional[str] = None

@app.get("/api/ping")
def ping():
    return {"status": "ok"}

@app.post("/api/verify")
async def verify(payload: dict = Body(...)):
    token = payload.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="No token provided")
    info = get_google_userinfo(token)
    with Session(engine) as session:
        user = session.get(User, info["sub"])
        now = datetime.now(timezone.utc)
        if user:
            user.last_login = now
        else:
            user = User(
                id=info["sub"],
                email=info["email"],
                name=info.get("name"),
                created_at=now,
                last_login=now,
                is_premium=False
            )
            session.add(user)
        session.commit()
        return {"userId": user.id, "email": user.email, "name": user.name}


@app.post("/api/generate-summary")
async def generate_summary_api(req: SummaryRequest):
    user_id = None
    info = None
    is_authorized = False
    is_premium = False
    email = None
    if req.token:
        info = get_google_userinfo(req.token)
        user_id = info["sub"]
        is_authorized = True
        email = info["email"]
    elif req.userId:
        user_id = req.userId
    else:
        raise HTTPException(status_code=400, detail="No user identification provided")
    with Session(engine) as session:
        user = session.get(User, user_id)
        now = datetime.now(timezone.utc)
        if is_authorized:
            if user:
                user.last_login = now
            else:
                user = User(
                    id=user_id,
                    email=email,
                    name=info.get("name") if info else None,
                    created_at=now,
                    last_login=now,
                    is_premium=False
                )
                session.add(user)
            is_premium = user.is_premium if user else False
        daily_limit = UNAUTH_LIMIT
        if is_authorized:
            daily_limit = AUTH_LIMIT
        if is_authorized and user and user.is_premium:
            daily_limit = PREMIUM_LIMIT if PREMIUM_LIMIT is not None else None
        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        statement = select(UserLimit).where(UserLimit.user_id == user_id, UserLimit.date == today)
        user_limit = session.exec(statement).first()
        if not user_limit:
            user_limit = UserLimit(user_id=user_id, date=today, requests_made=1, requests_limit=daily_limit)
            session.add(user_limit)
        elif user_limit.requests_made < daily_limit:
            user_limit.requests_made += 1
        else:
            raise HTTPException(status_code=429, detail="Daily limit exceeded")
        session.commit()
        try:
            summary = await generate_summary(req.text, req.model, req.detailLevel)
            return {
                "summary": summary,
                "requestsMade": user_limit.requests_made,
                "requestsLimit": user_limit.requests_limit,
            }
        except Exception as err:
            msg = str(err)
            if msg.startswith("openrouter_limit:"):
                raise HTTPException(status_code=503, detail="OpenRouter daily limit exceeded")
            raise HTTPException(status_code=500, detail="Ошибка генерации саммари (OpenRouter)")

