"""Application settings. Every value can be overridden with an environment variable."""

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Portfolio API"
    debug: bool = False

    # Comma-separated list of exact origins allowed to call the API.
    # Never use "*" here: it would let any site read authenticated responses.
    cors_origins: str = "http://localhost:3000"

    content_dir: Path = BASE_DIR / "content"
    # Where contact messages are appended. Keep this outside the repo in production.
    messages_file: Path = BASE_DIR.parent / "data" / "messages.jsonl"

    # Sliding-window rate limit for the contact endpoint.
    contact_rate_limit: int = 3
    contact_rate_window_seconds: int = 3600

    # Optional SMTP delivery. If unset, messages are only stored on disk.
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = Field(default=None, repr=False)
    smtp_from: str | None = None
    smtp_to: str | None = None

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def smtp_enabled(self) -> bool:
        return bool(self.smtp_host and self.smtp_from and self.smtp_to)


@lru_cache
def get_settings() -> Settings:
    return Settings()
