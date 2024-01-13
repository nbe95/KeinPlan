"""Constants for all KeinPlan modules."""

import logging
from os import environ
from typing import Optional

TEMPLATE_DIR: str = "./src/time_sheets/templates/"
LOCALE_LC_ALL: str = "de_DE.utf8"

KAPLAN_ICS_ENCODING: str = "utf-8"

URL: Optional[str] = environ.get("URL")
VERSION: Optional[str] = environ.get("VERSION")
DEBUG: bool = bool(environ.get("DEBUG"))
LOG_LEVEL: int = logging.DEBUG if DEBUG else logging.INFO
