"""Time sheet module for KeinPlan."""

import logging
from abc import abstractmethod
from datetime import date, datetime, timedelta
from locale import LC_ALL, format_string, setlocale
from pathlib import Path
from subprocess import CompletedProcess, run
from typing import Iterable, List, Tuple, Union

from jinja2 import Environment, FileSystemLoader, Template

from src.keinplan_backend.constants import LOG_LEVEL, VERSION_BACKEND

from .constants import KEINPLAN_LINK, TIME_SHEETS_LOCALE, TIME_SHEETS_TEMPLATE_DIR
from .entry import TimeEntry
from .templates.jinja_filters import escape_latex

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

    def _run_pandoc(
        self,
        input_str: str,
        input_type: str,
        output_file: Path,
        output_type: str,
        input_params: None | Iterable[str] = None,
        output_params: None | Iterable[str] = None,
    ) -> bool:
        """Convert preprocessed input to a document using pandoc."""
        cmd: Tuple[str, ...] = (
            "pandoc",
            "-f",
            "".join((input_type, *(input_params or []))),
            "-t",
            "".join((output_type, *(output_params or []))),
            "-o",
            str(output_file.absolute()),
        )
        result: CompletedProcess[str] = run(cmd, check=True, input=input_str, text=True)
        return result.returncode == 0

    @abstractmethod
    def generate(self, target_file: Path) -> bool:
        """Generate a time sheet as a specific file."""


class WeeklyTimeSheet(TimeSheet):
    """Time sheet based on calendar weeks."""

    def __init__(self, employer: str, employee: str, year: int, week_no: int) -> None:
        super().__init__(employer, employee)
        self.date_start = date.fromisocalendar(year, week_no, 1)
        self.date_end = self.date_start + timedelta(days=6)

    def generate(self, target_file: Union[Path, str], footer: bool = True) -> bool:
        """Generate a PDF time sheet from the given data."""
        target_pdf: Path = target_file if isinstance(target_file, Path) else Path(target_file)

        logger.info(
            "Generating weekly time sheet with %d entries at '%s'.", len(self.entries), target_pdf
        )

        template_file: str = "weekly.jinja.md"
        jinja_env: Environment = Environment(
            loader=FileSystemLoader(searchpath=TIME_SHEETS_TEMPLATE_DIR)
        )
        jinja_env.filters.update({"format_locale": format_string, "escape_latex": escape_latex})
        template: Template = jinja_env.get_template(template_file)

        self.entries.sort(key=lambda e: e.time_span.begin)
        md_rendered: str = template.render(
            employer=self.employer,
            employee=self.employee,
            entries=self.entries,
            date_start=self.date_start,
            date_end=self.date_end,
            total_hours=sum(e.calc_hours() for e in self.entries),
            generation_time=datetime.now(),
            footer=footer,
            hyperlink=KEINPLAN_LINK,
            version=VERSION_BACKEND,
        )
        return self._run_pandoc(md_rendered, "markdown", target_pdf, "pdf")
