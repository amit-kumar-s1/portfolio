"""Stores contact messages and, when SMTP is configured, emails them.

Storage always happens first so a mail outage never loses a message.
"""

import json
import logging
import smtplib
from datetime import datetime, timezone
from email.message import EmailMessage

from ..config import get_settings
from ..schemas import ContactMessage

logger = logging.getLogger(__name__)


def store(message: ContactMessage) -> None:
    settings = get_settings()
    settings.messages_file.parent.mkdir(parents=True, exist_ok=True)
    record = {
        "received_at": datetime.now(timezone.utc).isoformat(),
        "name": message.name,
        "email": str(message.email),
        "subject": message.subject,
        "message": message.message,
    }
    with settings.messages_file.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(record, ensure_ascii=False) + "\n")


def send(message: ContactMessage) -> bool:
    """Returns True if the message was emailed. Never raises into the request path."""
    settings = get_settings()
    if not settings.smtp_enabled:
        return False

    mail = EmailMessage()
    # Subject is header-injection safe: EmailMessage escapes newlines, and the
    # schema already strips control characters.
    mail["Subject"] = f"[portfolio] {message.subject}"
    mail["From"] = settings.smtp_from  # type: ignore[assignment]
    mail["To"] = settings.smtp_to  # type: ignore[assignment]
    mail["Reply-To"] = str(message.email)
    mail.set_content(f"From: {message.name} <{message.email}>\n\n{message.message}")

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
            server.starttls()
            if settings.smtp_user and settings.smtp_password:
                server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(mail)
        return True
    except Exception:
        logger.exception("Contact email delivery failed; message is stored on disk")
        return False
