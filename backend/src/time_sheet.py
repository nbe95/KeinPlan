"""Time sheet module for KeinPlan."""

from abc import abstractmethod
from datetime import date, datetime, timedelta
from locale import LC_ALL, setlocale, format_string
from pathlib import Path
from subprocess import CompletedProcess, run
from typing import List, Tuple

from jinja2 import Environment, FileSystemLoader, Template

from constants import LOCALE_LC_ALL, TEMPLATE_DIR, VERSION
from time_entry import TimeEntry

setlocale(LC_ALL, LOCALE_LC_ALL)


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
        cmd: Tuple[str, ...] = ("pandoc", "-o", str(pdf_file.absolute()))
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

    def generate(self, target_file: Path) -> bool:
        """Generate a PDF time sheet from the given data."""
        template_file: str = "weekly_time_sheet.jinja.md"
        jinja_env: Environment = Environment(
            loader=FileSystemLoader(searchpath=TEMPLATE_DIR)
        )
        jinja_env.filters.update({"format_locale": format_string})
        template: Template = jinja_env.get_template(template_file)
        rendered: str = template.render(
            employer=self.employer,
            employee=self.employee,
            entries=enumerate(self.entries),
            date_start=self.date_start,
            date_end=self.date_end,
            generation_time=datetime.now(),
            version=VERSION,
        )

        return self._convert_md_to_pdf(rendered, target_file)
