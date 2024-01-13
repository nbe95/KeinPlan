
from base64 import b64decode
from ics import Calendar, Event
from requests import get

from typing import List, Any, Dict

from re import match, Match

from src.constants import VERSION

from os import uname

class KaPlanIcs:

    user_agent: str = (
        f"Mozilla/5.0 ({uname().sysname} {uname().release}) "
        f"KeinPlan/{VERSION} (JSON)"
    )

    def __init__(self, ics_url: str) -> None:
        self.ics_url = ics_url

    def get_events(self) -> List[Any]:
        ics: str = get(self.ics_url, headers={"User-Agent": self.user_agent}).text
        cal: Calendar = Calendar(ics)
        return [self._parse_event(event) for event in cal.events]

    @staticmethod
    def _parse_event(event: Event) -> Dict[str, Any]:
        # Split role from description field
        description: str = (event.description or "").strip()
        role: str = ""
        role_matcher: Match = match(r"\[(.+)\]", description)
        if role_matcher:
            role = role_matcher.group(1)
            description = description[len(role) + 2:].strip()

        # Split host from description field
        host: str = ""
        host_matcher: Match = match(r".*Leitung: (.+?)$", description)
        if host_matcher:
            host = host_matcher.group(1)
            description = description[:-len(host) - 9].strip()

        return {
            "uid": event.uid,
            "title": event.name or "",
            "description": description,
            "role": role,
            "host": host,
            "location": event.location or "",
            "begin": event.begin.for_json(),
            "end": event.end.for_json(),
            "modified": event.last_modified.for_json()
        }

class KaPlanIcsCached(KaPlanIcs):
    pass
