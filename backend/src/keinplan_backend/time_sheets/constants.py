"""Specific endpoint constants."""

from os import environ

TIME_SHEETS_LOCALE: str = "de_DE.utf8"
TIME_SHEETS_TEMPLATE_DIR: str = "./src/keinplan_backend/time_sheets/templates/"

KEINPLAN_LINK: str | None = environ.get("KEINPLAN_LINK")
