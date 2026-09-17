"""Response and request models. These are the contract the frontend types mirror."""

from datetime import date
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator

ProjectStatus = Literal["live", "in-progress", "archived", "research"]
ModelStatus = Literal["published", "training", "experimental", "deprecated"]


class Link(BaseModel):
    label: str
    url: str


class Profile(BaseModel):
    name: str
    role: str
    tagline: str
    location: str
    summary: str
    focus: list[str] = []
    skills: list["SkillGroup"] = []
    interests: list[str] = []
    goals: list[str] = []
    links: list[Link] = []
    resume_url: str | None = None


class SkillGroup(BaseModel):
    area: str
    items: list[str]


class Project(BaseModel):
    slug: str
    title: str
    summary: str
    description: str
    category: str
    tech: list[str] = []
    status: ProjectStatus = "in-progress"
    year: int | None = None
    repo_url: str | None = None
    demo_url: str | None = None
    image: str | None = None
    featured: bool = False


class Achievement(BaseModel):
    title: str
    issuer: str
    kind: Literal["certification", "award", "research", "internship", "milestone"]
    date: date
    detail: str | None = None
    url: str | None = None


class Post(BaseModel):
    slug: str
    title: str
    summary: str
    body: str
    topic: str
    published: date
    reading_minutes: int = 1
    tags: list[str] = []


class PostSummary(BaseModel):
    slug: str
    title: str
    summary: str
    topic: str
    published: date
    reading_minutes: int = 1
    tags: list[str] = []


class Metric(BaseModel):
    label: str
    value: str


class AIModel(BaseModel):
    slug: str
    name: str
    description: str
    problem: str
    architecture: str
    dataset: str | None = None
    metrics: list[Metric] = []
    tech: list[str] = []
    status: ModelStatus = "experimental"
    repo_url: str | None = None
    hub_url: str | None = None
    demo_url: str | None = None


class ContactMessage(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    subject: str = Field(min_length=3, max_length=120)
    message: str = Field(min_length=20, max_length=4000)
    # Hidden field: real people leave it empty, most bots fill it in.
    website: str = Field(default="", max_length=0)

    @field_validator("name", "subject", "message")
    @classmethod
    def strip_and_reject_control_chars(cls, value: str) -> str:
        cleaned = "".join(ch for ch in value if ch == "\n" or ch == "\t" or ch >= " ").strip()
        if not cleaned:
            raise ValueError("Field cannot be blank")
        return cleaned


class ContactReceipt(BaseModel):
    received: bool
    delivered: bool


Profile.model_rebuild()
