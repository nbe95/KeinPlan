"""KaPlan ICS interface module."""

from os import uname
from re import Match, match
from typing import Any, Dict, List, Optional

from ics import Calendar, Event
from requests import get

from src.constants import VERSION


class KaPlanIcs:
    """KaPlan ICS web interface."""

    user_agent: str = (
        f"Mozilla/5.0 ({uname().sysname} {uname().release}) "
        f"KeinPlan/{VERSION} (JSON)"
    )
    timeout_s: int = 20

    def __init__(self, ics_url: str) -> None:
        self.ics_url = ics_url

    def get_events(self) -> List[Any]:
        """Fetch all events from the KaPlan ICS endpoint."""
        ics: str = get(
            self.ics_url,
            timeout=self.timeout_s,
            headers={"User-Agent": self.user_agent},
        ).text
        cal: Calendar = Calendar(ics)
        return [self._parse_event(event) for event in cal.events]

    @staticmethod
    def _parse_event(event: Event) -> Dict[str, Any]:
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
    """Cached ICS web interface."""
