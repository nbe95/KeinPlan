
from base64 import b64decode
from ics import Calendar
from requests import get

from typing import List, Any


class KaPlanIcs:

    def __init__(self, ics_url: str) -> None:
        self.ics_url = ics_url

    def get_events(self) -> List[Any]:
        ics: str = get(self.ics_url).text

        cal: Calendar = Calendar(ics)
        return len(cal.events)


class KaPlanIcsCached(KaPlanIcs):
    pass
