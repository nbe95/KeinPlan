"""Constants for all KeinPlan modules."""

import logging
from os import environ
from typing import Optional

DEBUG: bool = bool(environ.get("DEBUG"))
LOG_LEVEL: int = logging.DEBUG if DEBUG else logging.INFO

VERSION_BACKEND: Optional[str] = environ.get("KEINPLAN_VERSION")
VERSION_SHA_BACKEND: Optional[str] = environ.get("KEINPLAN_VERSION_SHA")
IS_TESTING: bool = "KEINPLAN_TESTING" in environ
