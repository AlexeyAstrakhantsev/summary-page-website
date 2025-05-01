from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import httpx
from prisma import Prisma

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

prisma = Prisma()

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

@app.on_event("startup")
async def on_startup():
    await prisma.connect()

@app.on_event("shutdown")
async def on_shutdown():
    await prisma.disconnect()

@app.get("/api/user-info", response_model=UserInfo)
async def user_info(token: Optional[str] = Query(None), userId: Optional[str] = Query(None)):
    if token:
        info = get_google_userinfo(token)
        user_id = info["sub"]
    elif userId:
        user_id = userId
    else:
        raise HTTPException(status_code=400, detail="No user identification provided")

    user = await prisma.user.find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserInfo(**user)

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
    user = await prisma.user.upsert(
        where={"id": info["sub"]},
        update={"lastLogin": datetime.now(timezone.utc)},
        create={
            "id": info["sub"],
            "email": info["email"],
            "name": info.get("name"),
            "createdAt": datetime.now(timezone.utc),
            "lastLogin": datetime.now(timezone.utc),
        },
    )
    return {"userId": user.id, "email": user.email, "name": user.name}

@app.post("/api/generate-summary")
async def generate_summary_api(req: SummaryRequest):
    # 1. Определяем userId и статус
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
    # 2. Upsert user (только если авторизован)
    user = None
    if is_authorized:
        user = await prisma.user.upsert(
            where={"id": user_id},
            update={"lastLogin": datetime.now(timezone.utc)},
            create={
                "id": user_id,
                "email": info["email"],
                "name": info.get("name"),
                "createdAt": datetime.now(timezone.utc),
                "lastLogin": datetime.now(timezone.utc),
            },
        )
        is_premium = getattr(user, "isPremium", False)
    # 3. Определяем лимит
    daily_limit = UNAUTH_LIMIT
    if is_authorized and is_premium:
        daily_limit = PREMIUM_LIMIT
    elif is_authorized:
        daily_limit = AUTH_LIMIT
    # 4. Премиум — безлимит
    if is_authorized and is_premium:
        summary = await generate_summary(req.text, req.model, req.detailLevel)
        return {"summary": summary, "requestsMade": 0, "requestsLimit": None}
    # 5. Работа с лимитом
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    user_limit = await prisma.userlimit.find_unique(where={"userId_date": {"userId": user_id, "date": today}})
    if not user_limit:
        if not is_authorized:
            await prisma.user.upsert(
                where={"id": user_id},
                update={},
                create={
                    "id": user_id,
                    "email": f"guest+{user_id}@local",
                    "name": "Guest User",
                    "createdAt": datetime.now(timezone.utc),
                    "lastLogin": datetime.now(timezone.utc),
                    "isPremium": False,
                },
            )
        user_limit = await prisma.userlimit.create(
            data={
                "userId": user_id,
                "date": today,
                "requestsMade": 1,
                "requestsLimit": daily_limit,
            }
        )
    elif user_limit.requestsMade < daily_limit:
        if user_limit.requestsLimit != daily_limit:
            user_limit = await prisma.userlimit.update(
                where={"id": user_limit.id},
                data={"requestsLimit": daily_limit},
            )
        user_limit = await prisma.userlimit.update(
            where={"id": user_limit.id},
            data={"requestsMade": {"increment": 1}},
        )
    else:
        raise HTTPException(status_code=429, detail={
            "error": "Daily limit exceeded",
            "requestsMade": user_limit.requestsMade,
            "requestsLimit": user_limit.requestsLimit,
        })
    # Генерация саммари через OpenRouter
    try:
        summary = await generate_summary(req.text, req.model, req.detailLevel)
        return {
            "summary": summary,
            "requestsMade": user_limit.requestsMade,
            "requestsLimit": user_limit.requestsLimit,
        }
    except Exception as err:
        msg = str(err)
        if msg.startswith("openrouter_limit:"):
            raise HTTPException(status_code=503, detail="OpenRouter daily limit exceeded")
        raise HTTPException(status_code=500, detail="Ошибка генерации саммари (OpenRouter)")

