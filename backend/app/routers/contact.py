from fastapi import APIRouter, Depends, Request

from ..config import Settings, get_settings
from ..schemas import ContactMessage, ContactReceipt
from ..services import mailer
from ..services.rate_limit import SlidingWindowLimiter, client_key

router = APIRouter(tags=["contact"])

_settings = get_settings()
_limiter = SlidingWindowLimiter(
    limit=_settings.contact_rate_limit,
    window_seconds=_settings.contact_rate_window_seconds,
)


@router.post("/contact", response_model=ContactReceipt, status_code=202)
def submit_contact(
    message: ContactMessage,
    request: Request,
    settings: Settings = Depends(get_settings),
) -> ContactReceipt:
    _limiter.check(client_key(request))
    mailer.store(message)
    delivered = mailer.send(message)
    return ContactReceipt(received=True, delivered=delivered)
