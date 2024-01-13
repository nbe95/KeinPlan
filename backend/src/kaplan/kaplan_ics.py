"""KaPlan ICS interface module."""

import logging
from datetime import datetime, timedelta
from hashlib import sha256
from os import uname
from re import Match, match
from typing import Any, Dict, Optional, Tuple

from hyperlink import HYPERLINK
from ics import Calendar, Event
from requests import Response, get

from src.constants import KAPLAN_ICS_ENCODING, LOG_LEVEL, VERSION

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)
logger.setLevel(LOG_LEVEL)


class KaPlanIcs:
    """KaPlan ICS web interface."""

    timeout_s: int = 20
    user_agent: str = (
        f"Mozilla/5.0 ({uname().sysname} {uname().release}) "
        f"KeinPlan/{VERSION} (JSON)"
    )

    def get_events(self, ics_url: str) -> Dict[str, Any]:
        """Call the KaPlan endpoint and return all available dates."""
        normalized_url: str = URL.from_text(ics_url).normalize().to_text()
        ics: str
        fetch_date: datetime
        ics, fetch_date = self.fetch_ics_data(normalized_url)
        cal: Calendar = Calendar(ics)

        logger.info("Retrieving %d dates from KaPlan data.", len(cal.events))
        return {
            "dates": [self._parse_event(event) for event in cal.events],
            "fetched": fetch_date.isoformat(),
        }

    def fetch_ics_data(self, ics_url: str) -> Tuple[str, datetime]:
        """Actual method to call the KaPlan endpoint.

        Returns the ICS payload and a fetch date.
        """
        logger.info(
            "Fetching ICS data from KaPlan with user-agent '%s'.",
            self.user_agent,
        )
        headers: Dict[str, str] = {"User-Agent": self.user_agent}
        response: Response = get(
            ics_url, timeout=self.timeout_s, headers=headers
        )
        if not response.ok:
            logger.error(
                "Server returned status %d: %s",
                response.status,
                response.reason,
            )
            raise ValueError(
                f"Got an error with code {response.status} from KaPlan server."
            )

        content: str = response.content.decode(KAPLAN_ICS_ENCODING)
        logger.info(
            "Fetched %d bytes in %fs.",
            len(content),
            response.elapsed.total_seconds(),
        )
        return content, datetime.now()

    @staticmethod
    def _parse_event(event: Event) -> Dict[str, Any]:
        """Parse a single date object to meet our format requirements."""
        # A typical description looks like this:
        # "[{role}] {description} Leitung: {host}"

        # Split role from description field
        description: str = (event.description or "").strip()
        role: str = ""
        role_matcher: Optional[Match] = match(r"\[(.+)\]", description)
        if role_matcher:
            role = role_matcher.group(1)
            description = description[len(role) + 2 :].strip()

        # Split host from description field
        host: str = ""
        host_matcher: Optional[Match] = match(
            r".*Leitung: (.+?)$", description
        )
        if host_matcher:
            host = host_matcher.group(1)
            description = description[: -len(host) - 9].strip()

        return {
            "uid": event.uid,
            "title": event.name or "",
            "description": description,
            "role": role,
            "host": host,
            "location": event.location or "",
            "begin": event.begin.for_json(),
            "end": event.end.for_json(),
            "modified": event.last_modified.for_json(),
        }


class KaPlanIcsCached(KaPlanIcs):
    """KaPlan ICS web interface using cached data."""

    ttl: timedelta = timedelta(minutes=15)

    def __init__(self) -> None:
        self.cache: Dict[bytes, Tuple[str, datetime]] = {}

    def fetch_ics_data(self, ics_url: str) -> Tuple[str, datetime]:
        """Lookup the cache first before performing the request."""
        hashed_url = sha256(ics_url.encode("ascii"))
        key: bytes = hashed_url.digest()
        cached: Optional[Tuple[str, datetime]] = self.cache.get(key)
        if cached and cached[1] + self.ttl >= datetime.now():
            logger.info(
                "Using cached query %s from %s.",
                hashed_url.hexdigest(),
                cached[1],
            )
        else:
            self.cache[key] = super().fetch_ics_data(ics_url)

        return self.cache[key]
