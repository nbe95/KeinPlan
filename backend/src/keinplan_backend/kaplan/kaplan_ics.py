"""KaPlan ICS interface module."""

import logging
from datetime import date, datetime, timedelta
from hashlib import sha256
from os import uname
from re import Match, fullmatch
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import ParseResult, parse_qs, urlparse

from ics import Calendar, Event
from requests import Response, get

from src.keinplan_backend.constants import LOG_LEVEL, VERSION_BACKEND

from .constants import (
    KAPLAN_ALLOWED_SERVERS,
    KAPLAN_ALLOWED_WORKGROUPS,
    KAPLAN_CACHE_TTL,
    KAPLAN_ICS_ENCODING,
)

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)
logger.setLevel(LOG_LEVEL)


class KaPlanInterfaceError(Exception):
    """Custom exception to catch and provide a meaningful user feedback."""


class KaPlanIcs:
    """KaPlan ICS web interface."""

    timeout_s: int = 20
    user_agent: str = (
        f"Mozilla/5.0 ({uname().sysname} {uname().release}) "
        f"KeinPlan/{VERSION_BACKEND or 'beta'} (JSON)"
    )
    own_server_url: str = ""

    @classmethod
    def set_own_url(cls, server_url: str) -> None:
        """Save this server's public URL for later checks, if not done yet."""
        if not cls.own_server_url:
            url: ParseResult = urlparse(server_url)
            cls.own_server_url = url.netloc
            logger.info('This server\'s public URL appears to be "%s".', cls.own_server_url)

    def get_events(self, url: str, date_from: date, date_to: date) -> Dict[str, Any]:
        """Call the KaPlan endpoint and return all available dates."""
        if not self._validate_url(url):
            raise KaPlanInterfaceError(
                "The specified URL is either invalid or does not meet the requirements of this "
                "server."
            )

        ics: str
        fetch_date: datetime
        ics, fetch_date = self.fetch_ics_data(url)
        try:
            cal: Calendar = Calendar(ics)
        except Exception as e:
            raise KaPlanInterfaceError("Could not parse KaPlan ICS data.") from e

        dates: List[Dict[str, Any]] = [
            self._parse_event(event)
            for event in sorted(cal.events, key=lambda e: e.begin)
            if event.begin.date() >= date_from and event.end.date() <= date_to
        ]
        logger.info(
            "Retrieved %d dates (%d total) from KaPlan server between %s and %s.",
            len(dates),
            len(cal.events),
            date_from,
            date_to,
        )
        return {"dates": dates, "fetched": fetch_date.isoformat()}

    def fetch_ics_data(self, url: str) -> Tuple[str, datetime]:
        """Actual method to call the KaPlan endpoint.

        Returns the ICS payload and a fetch date.
        """
        logger.info("Fetching data from KaPlan with user-agent '%s'.", self.user_agent)
        headers: Dict[str, str] = {"User-Agent": self.user_agent}
        response: Response = get(url, timeout=self.timeout_s, headers=headers)
        if not response.ok:
            logger.error("Server returned status %d: %s", response.status_code, response.reason)
            raise KaPlanInterfaceError(
                f"Got response code {response.status_code} from KaPlan server."
            )

        content: str = response.content.decode(KAPLAN_ICS_ENCODING)
        if content == "VCAL API: Parameter Error.":
            raise KaPlanInterfaceError("Got VCAL API parameter error from KaPlan server.")

        logger.info("Fetched %d bytes in %fs.", len(content), response.elapsed.total_seconds())
        return content, datetime.now()

    @staticmethod
    def _parse_event(event: Event) -> Dict[str, Any]:
        """Parse a single date object to meet our format requirements."""
        # Split optional fields from textual representation
        # A typical description field looks like this:
        # "[{role}] {title} Leitung: {host} Interne Info: {internal}"

        role: Optional[str] = None
        host: Optional[str] = None
        internal: Optional[str] = None
        matcher: Optional[Match[str]] = fullmatch(
            r"(?:\[(.+)\] )?(.*?)(?: Leitung: (.*?))?(?: Interne Info: (.*?))?",
            event.description or "",
        )
        if matcher:
            role, _, host, internal = matcher.groups()

        location_matcher: Optional[Match[str]] = fullmatch(r"(.+), \d+ .+", event.location or "")
        short_location: Optional[str] = (
            event.location if not location_matcher else location_matcher.group(1)
        )

        return {
            "uid": event.uid,
            "title": event.name,
            "internal": internal,
            "role": role,
            "host": host,
            "location": event.location,
            "location_short": short_location,
            "begin": event.begin.for_json(),
            "end": event.end.for_json(),
            "modified": event.last_modified.for_json() if event.last_modified else None,
        }

    @classmethod
    def _validate_url(cls, url_str: str) -> bool:
        """Check if the specified URL meets the configured requirements."""
        url: ParseResult = urlparse(url_str)
        query: Dict[str, List[str]] = parse_qs(url.query)

        # Allow own server URL for e2e testing
        if url.netloc == cls.own_server_url:
            return True

        # Extract host and workgroup from URL
        host: str = url.netloc
        workgroup: Optional[str] = next(iter(query.get("Arbeitsgruppe", [])), None)

        if all(x is None for x in (host, workgroup)):
            logger.warning("Invalid URL without host or workgroup provided.")
            return False

        if KAPLAN_ALLOWED_SERVERS and host not in KAPLAN_ALLOWED_SERVERS:
            logger.warning("'%s' is not within the allowed KaPlan hosts.", host)
            return False

        if KAPLAN_ALLOWED_WORKGROUPS and workgroup not in KAPLAN_ALLOWED_WORKGROUPS:
            logger.warning("'%s' is not within the allowed KaPlan workgroups.", workgroup)
            return False

        return True


class KaPlanIcsCached(KaPlanIcs):
    """KaPlan ICS web interface using cached data."""

    ttl: timedelta = timedelta(seconds=KAPLAN_CACHE_TTL)

    def __init__(self) -> None:
        self.cache: Dict[bytes, Tuple[str, datetime]] = {}

    def fetch_ics_data(self, url: str) -> Tuple[str, datetime]:
        """Lookup the cache first before performing the request."""
        url_hash: bytes = self._get_hash(url)
        cached: Optional[Tuple[str, datetime]] = self.cache.get(url_hash)
        if cached and cached[1] + self.ttl >= datetime.now():
            logger.info("Using cached query %s from %s.", url_hash.hex(), cached[1])
        else:
            self.cache[url_hash] = super().fetch_ics_data(url)
        return self.cache[url_hash]

    @staticmethod
    def _get_hash(url_str: str) -> bytes:
        """Hash the characteristic parts of a KaPlan URL for identification."""
        url: ParseResult = urlparse(url_str)
        query: Dict[str, List[str]] = parse_qs(url.query)
        hash_str: str = "|".join(
            (
                url.netloc,
                url.path,
                "".join(query.get("Arbeitsgruppe", [])),
                "".join(query.get("Email", [])),
                "".join(query.get("ref", [])),
            )
        )
        return sha256(hash_str.encode("ascii")).digest()
