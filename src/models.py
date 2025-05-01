from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List

class UserLimit(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    date: datetime
    requests_made: int = Field(default=1, alias="requestsMade")
    requests_limit: int = Field(default=10, alias="requestsLimit")

class User(SQLModel, table=True):
    id: str = Field(primary_key=True)  # Google sub
    email: str
    name: Optional[str]
    created_at: datetime = Field(default_factory=datetime.utcnow, alias="createdAt")
    last_login: datetime = Field(alias="lastLogin")
    is_premium: bool = Field(default=False, alias="isPremium")
    limits: List[UserLimit] = Relationship(back_populates=None)
