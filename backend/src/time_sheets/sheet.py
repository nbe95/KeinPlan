"""Time sheet module for KeinPlan."""

import logging
from abc import abstractmethod
from datetime import date, datetime, timedelta
from locale import LC_ALL, format_string, setlocale
from pathlib import Path
from subprocess import CompletedProcess, run
from typing import List, Tuple, Union

from jinja2 import Environment, FileSystemLoader, Template

from src.constants import KEINPLAN_LINK, LOG_LEVEL, VERSION

from .constants import TIME_SHEETS_LOCALE, TIME_SHEETS_TEMPLATE_DIR
from .entry import TimeEntry

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)
logger.setLevel(LOG_LEVEL)

setlocale(LC_ALL, TIME_SHEETS_LOCALE)


class TimeSheet:
    """Base class for all kinds of time sheets."""

    def __init__(self, employer: str, employee: str) -> None:
        self.employer: str = employer
        self.employee: str = employee

        self.date_start: date = date.min
        self.date_end: date = date.max
        self.entries: List[TimeEntry] = []

    def _convert_md_to_pdf(self, md_input: str, pdf_file: Path) -> bool:
        """Convert preprocessed Markdown input to a PDF file using pandoc."""
        cmd: Tuple[str, ...] = (
            "pandoc",
            "-t",
            "pdf",
            "-o",
            str(pdf_file.absolute()),
        )
        result: CompletedProcess = run(
            cmd, check=True, input=md_input, text=True
        )
        return result.returncode == 0

    @abstractmethod
    def generate(self, target_file: Path) -> bool:
        """Generate a time sheet as a specific file."""


class WeeklyTimeSheet(TimeSheet):
    """Time sheet based on calendar weeks."""

    def __init__(
        self, employer: str, employee: str, year: int, week_no: int
    ) -> None:
        super().__init__(employer, employee)
        self.date_start = date.fromisocalendar(year, week_no, 1)
        self.date_end = self.date_start + timedelta(days=6)

    def generate(
        self, target_file: Union[Path, str], footer: bool = True
    ) -> bool:
        """Generate a PDF time sheet from the given data."""
        target_path: Path = (
            target_file if isinstance(target_file, Path) else Path(target_file)
        )

        logger.info(
            "Generating weekly time sheet with %d entries at '%s'.",
            len(self.entries),
            target_path,
        )

        template_file: str = "weekly.jinja.md"
        jinja_env: Environment = Environment(
            loader=FileSystemLoader(searchpath=TIME_SHEETS_TEMPLATE_DIR)
        )
        jinja_env.filters.update({"format_locale": format_string})
        template: Template = jinja_env.get_template(template_file)

        self.entries.sort(key=lambda e: e.time_span.begin)
        rendered: str = template.render(
            employer=self.employer,
            employee=self.employee,
            entries=self.entries,
            date_start=self.date_start,
            date_end=self.date_end,
            total_hours=sum(e.calc_hours() for e in self.entries),
            generation_time=datetime.now(),
            footer=footer,
            hyperlink=KEINPLAN_LINK,
            version=VERSION,
        )
        return self._convert_md_to_pdf(rendered, target_path)
