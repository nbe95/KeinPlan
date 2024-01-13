"""KaPlan ICS interface module."""

from datetime import datetime, timedelta
from hashlib import sha256
from os import uname
from re import Match, match
from typing import Any, Dict, Optional, Tuple

from hyperlink import URL
from ics import Calendar, Event
from requests import get

from src.constants import VERSION


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
        return {
            "dates": [self._parse_event(event) for event in cal.events],
            "fetched": fetch_date.isoformat(),
        }

    def fetch_ics_data(self, ics_url: str) -> Tuple[str, datetime]:
        """Actual method to call the KaPlan endpoint.

        Returns the ICS payload and a fetch date.
        """
        headers: Dict[str, str] = {"User-Agent": self.user_agent}
        ics: str = get(ics_url, timeout=self.timeout_s, headers=headers).text
        return ics, datetime.now()

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
        hashed_url: bytes = sha256(ics_url.encode("ascii")).digest()
        cached: Optional[Tuple[str, datetime]] = self.cache.get(hashed_url)
        if not cached or cached[1] + self.ttl < datetime.now():
            self.cache[hashed_url] = super().fetch_ics_data(ics_url)

        return self.cache[hashed_url]
