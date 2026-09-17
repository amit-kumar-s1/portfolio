from fastapi import APIRouter, HTTPException, Query, Response, status

from ..schemas import Achievement, AIModel, Post, PostSummary, Profile, Project
from ..services import content_store

router = APIRouter(tags=["content"])

# Read-only content changes only on redeploy, so let CDNs and browsers cache it.
CACHE_CONTROL = "public, max-age=300, stale-while-revalidate=86400"


def _cached(response: Response) -> None:
    response.headers["Cache-Control"] = CACHE_CONTROL


@router.get("/profile", response_model=Profile)
def read_profile(response: Response) -> Profile:
    _cached(response)
    return content_store.get_profile()


@router.get("/projects", response_model=list[Project])
def read_projects(
    response: Response,
    category: str | None = Query(default=None, max_length=40),
) -> list[Project]:
    _cached(response)
    projects = content_store.list_projects()
    if category:
        needle = category.casefold()
        projects = [p for p in projects if p.category.casefold() == needle]
    return projects


@router.get("/achievements", response_model=list[Achievement])
def read_achievements(response: Response) -> list[Achievement]:
    _cached(response)
    return content_store.list_achievements()


@router.get("/posts", response_model=list[PostSummary])
def read_posts(response: Response) -> list[PostSummary]:
    _cached(response)
    return [PostSummary.model_validate(post.model_dump()) for post in content_store.list_posts()]


@router.get("/posts/{slug}", response_model=Post)
def read_post(slug: str, response: Response) -> Post:
    post = content_store.get_post(slug)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    _cached(response)
    return post


@router.get("/models", response_model=list[AIModel])
def read_models(response: Response) -> list[AIModel]:
    _cached(response)
    return content_store.list_models()
