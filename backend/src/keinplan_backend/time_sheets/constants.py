"""Specific endpoint constants."""

from os import environ
from typing import Optional

TIME_SHEETS_LOCALE: str = "de_DE.utf8"
TIME_SHEETS_TEMPLATE_DIR: str = "./src/keinplan_backend/time_sheets/templates/"

KEINPLAN_LINK: Optional[str] = environ.get("KEINPLAN_LINK")
