"""Constants for all KeinPlan modules."""

import logging
from os import environ
from typing import Optional

DEBUG: bool = bool(environ.get("DEBUG"))
LOG_LEVEL: int = logging.DEBUG if DEBUG else logging.INFO

HYPERLINK: Optional[str] = environ.get("KEINPLAN_HYPERLINK")
VERSION: Optional[str] = environ.get("KEINPLAN_VERSION")
