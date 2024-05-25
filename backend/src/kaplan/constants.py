"""Specific endpoint constants."""

from os import environ
from typing import List
from urllib.parse import urlparse

KAPLAN_ICS_ENCODING: str = "utf-8"
KAPLAN_ICS_HEADER: str = "X-KaPlan-ICS"
KAPLAN_ALLOWED_SERVERS: List[str] = [
    urlparse(host).netloc for host in environ.get("KAPLAN_ALLOWED_SERVERS", "").split(",")
]
KAPLAN_ALLOWED_WORKGROUPS: List[str] = environ.get("KAPLAN_ALLOWED_WORKGROUPS", "").split(",")
KAPLAN_CACHE_TTL: int = 900
