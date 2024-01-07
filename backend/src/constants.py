"""Constants for all KeinPlan modules."""

from os import environ

TEMPLATE_DIR: str = "./time_sheets/templates"
LOCALE_LC_ALL: str = "de_DE.utf8"

VERSION: str = environ.get("VERSION") or "<???>"
