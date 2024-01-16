"""KaPlan ICS interface module."""

import logging
from datetime import datetime, timedelta, tzinfo
from hashlib import sha256
from os import uname
from re import Match, match
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import ParseResult, parse_qs, urlparse

from ics import Calendar, Event
from requests import Response, get

from src.constants import LOG_LEVEL, VERSION

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
        f"KeinPlan/{VERSION or 'beta'} (JSON)"
    )

    def get_events(
        self, url: str, date_from: datetime, date_to: datetime
    ) -> Dict[str, Any]:
        """Call the KaPlan endpoint and return all available dates."""
        if not self._validate_url(url):
            raise KaPlanInterfaceError(
                "The specified URL is either invalid or does not meet the "
                "requirements of this server."
            )

        ics: str
        fetch_date: datetime
        ics, fetch_date = self.fetch_ics_data(url)
        cal: Calendar = Calendar(ics)

        # Ensure that any datetime objects has its timezone
        local_tz: Optional[tzinfo] = datetime.now().astimezone().tzinfo
        if date_from.tzinfo is None:
            date_from = date_from.replace(tzinfo=local_tz)

        if date_to.tzinfo is None:
            date_to = date_to.replace(tzinfo=local_tz)

        dates: List[Dict[str, Any]] = [
            self._parse_event(event)
            for event in cal.events
            if event.begin >= date_from and event.end <= date_to
        ]
        logger.info(
            "Retrieved %d dates (%d total) from KaPlan between %s and %s.",
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
        logger.info(
            "Fetching data from KaPlan with user-agent '%s'.",
            self.user_agent,
        )
        headers: Dict[str, str] = {"User-Agent": self.user_agent}
        response: Response = get(url, timeout=self.timeout_s, headers=headers)
        if not response.ok:
            logger.error(
                "Server returned status %d: %s",
                response.status,
                response.reason,
            )
            raise KaPlanInterfaceError(
                f"Got an error from KaPlan server with code {response.status}."
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

    @staticmethod
    def _validate_url(url_str: str) -> bool:
        """Check if the specified URL meets the configured requirements."""
        url: ParseResult = urlparse(url_str)
        query: Dict[str, List[str]] = parse_qs(url.query)

        # Extract host and workgroup from URL
        host: str = url.netloc
        workgroup: Optional[str] = next(
            iter(query.get("Arbeitsgruppe", [])), None
        )

        return (
            host in KAPLAN_ALLOWED_SERVERS
            and workgroup in KAPLAN_ALLOWED_WORKGROUPS
        )


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
            logger.info(
                "Using cached query %s from %s.",
                url_hash.hex(),
                cached[1],
            )
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
