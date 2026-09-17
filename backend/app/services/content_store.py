"""Loads portfolio content from JSON files and validates it against the schemas.

Content is read once and cached in memory. Editing a JSON file means restarting the
API (or calling reload() in development). This keeps the site database-free.
"""

import json
from pathlib import Path
from typing import Any, TypeVar

from pydantic import BaseModel, TypeAdapter

from ..config import get_settings
from ..schemas import Achievement, AIModel, Post, Profile, Project

T = TypeVar("T", bound=BaseModel)

_cache: dict[str, Any] = {}


def _read(filename: str) -> Any:
    path: Path = get_settings().content_dir / filename
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def _load_list(filename: str, model: type[T]) -> list[T]:
    if filename not in _cache:
        _cache[filename] = TypeAdapter(list[model]).validate_python(_read(filename))
    return _cache[filename]


def reload() -> None:
    _cache.clear()


def get_profile() -> Profile:
    if "profile.json" not in _cache:
        _cache["profile.json"] = Profile.model_validate(_read("profile.json"))
    return _cache["profile.json"]


def list_projects() -> list[Project]:
    return sorted(_load_list("projects.json", Project), key=lambda p: (p.year or 0), reverse=True)


def list_achievements() -> list[Achievement]:
    return sorted(_load_list("achievements.json", Achievement), key=lambda a: a.date, reverse=True)


def list_posts() -> list[Post]:
    return sorted(_load_list("posts.json", Post), key=lambda p: p.published, reverse=True)


def get_post(slug: str) -> Post | None:
    return next((post for post in list_posts() if post.slug == slug), None)


def list_models() -> list[AIModel]:
    return _load_list("models.json", AIModel)


def warm_cache() -> None:
    """Validate every content file at startup so bad data fails loudly, not per-request."""
    get_profile()
    list_projects()
    list_achievements()
    list_posts()
    list_models()
