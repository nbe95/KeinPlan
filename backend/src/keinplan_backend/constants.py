"""Constants for all KeinPlan modules."""

import logging
from os import environ

DEBUG: bool = bool(environ.get("DEBUG"))
LOG_LEVEL: int = logging.DEBUG if DEBUG else logging.INFO

VERSION_BACKEND: str | None = environ.get("KEINPLAN_VERSION")
VERSION_SHA_BACKEND: str | None = environ.get("KEINPLAN_VERSION_SHA")
