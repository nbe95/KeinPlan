"""Constants for all KeinPlan modules."""

import logging
from os import environ
from typing import List, Optional
from urllib.parse import urlparse

TIME_SHEETS_LOCALE: str = "de_DE.utf8"
TIME_SHEETS_TEMPLATE_DIR: str = "./src/time_sheets/templates/"

KAPLAN_ICS_ENCODING: str = "utf-8"
KAPLAN_ALLOWED_SERVERS: List[str] = [
    urlparse(host).netloc
    for host in environ.get("KAPLAN_ALLOWED_SERVERS", "").split(",")
]
KAPLAN_ALLOWED_WORKGROUPS: List[str] = environ.get(
    "KAPLAN_ALLOWED_WORKGROUPS", ""
).split(",")

HYPERLINK: Optional[str] = environ.get("KEINPLAN_HYPERLINK")
VERSION: Optional[str] = environ.get("VERSION")
DEBUG: bool = bool(environ.get("DEBUG"))
LOG_LEVEL: int = logging.DEBUG if DEBUG else logging.INFO
