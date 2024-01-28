"""Constants for all KeinPlan modules."""

import logging
from os import environ
from typing import Optional

DEBUG: bool = bool(environ.get("DEBUG"))
LOG_LEVEL: int = logging.DEBUG if DEBUG else logging.INFO

ADMIN_MAIL: Optional[str] = environ.get("ADMIN_MAIL")
GITHUB_LINK: Optional[str] = environ.get("GITHUB_LINK")
KAPLAN_LINK: Optional[str] = environ.get("KAPLAN_LINK")
KEINPLAN_LINK: Optional[str] = environ.get("KEINPLAN_LINK")
VERSION: Optional[str] = environ.get("KEINPLAN_VERSION")
