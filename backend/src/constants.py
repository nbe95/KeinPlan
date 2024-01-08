"""Constants for all KeinPlan modules."""

from os import environ
from typing import Optional

TEMPLATE_DIR: str = "./src/time_sheets/templates/"
LOCALE_LC_ALL: str = "de_DE.utf8"

URL: Optional[str] = environ.get("URL")
VERSION: Optional[str] = environ.get("VERSION")
