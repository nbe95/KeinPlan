"""Time sheet module for KeinPlan."""

import logging
from abc import abstractmethod
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from locale import LC_ALL, format_string, setlocale
from pathlib import Path
from subprocess import CalledProcessError, run
from typing import List, Optional, Tuple

from jinja2 import Environment, FileSystemLoader, Template

from src.keinplan_backend.constants import LOG_LEVEL, VERSION_BACKEND

from ..constants import KEINPLAN_LINK, TIME_SHEETS_LOCALE, TIME_SHEETS_TEMPLATE_DIR
from ..templates.jinja_filters import escape_latex
from .time_entry import TimeEntry

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)
logger.setLevel(LOG_LEVEL)

setlocale(LC_ALL, TIME_SHEETS_LOCALE)


class TimeSheet:
    """Base class for all kinds of time sheets."""

    def __init__(self, employer: str, employee: str) -> None:
        self.employer: str = employer
        self.employee: str = employee
        self.entries: List[TimeEntry] = []

    def _run_latex(self, tex_file: Path, pdf_file: Path) -> bool:
        """Convert preprocessed input to a document using pdflatex."""
        cmd: Tuple[str, ...] = (
            "pdflatex",
            "--interaction",
            "nonstopmode",
            "--output-directory",
            str(pdf_file.parent.absolute()),
            "--jobname",
            str(pdf_file.stem),  # File name without extension
            str(tex_file.absolute()),
        )
        try:
            run(cmd, capture_output=True, text=True, check=True)
        except CalledProcessError as e:
            logger.error(
                f"A LaTeX error occurred while generating {pdf_file}. "
                "Dumping output as DEBUG message."
            )
            logger.debug(f"{'-' * 50} BEGIN LATEX DUMP {'-' * 50}")
            logger.debug(e.stdout)
            logger.debug(f"{'-' * 50} END LATEX DUMP {'-' * 50}")
            return False
        return True

    @abstractmethod
    def generate_pdf(self, tmp_dir: Path) -> Optional[Path]:
        """Generate a time sheet as a specific file."""


class WeeklyTimeSheet(TimeSheet):
    """Time sheet based on calendar weeks."""

    @dataclass(frozen=True)
    class DayListing:
        """Container for a day listing."""

        day: date
        entries: List[TimeEntry]
        total_hours: float

    def __init__(self, employer: str, employee: str, year: int, week_no: int) -> None:
        super().__init__(employer, employee)
        self.year = year
        self.week_no = week_no

    def generate_pdf(self, tmp_dir: Path, footer: bool = True) -> Optional[Path]:
        """Generate a PDF time sheet from the given data."""
        rendered_file: Path = tmp_dir / "rendered.tex"
        pdf_file = tmp_dir / "out.pdf"
        logger.info(
            "Generating weekly time sheet with %d entries at '%s'.", len(self.entries), pdf_file
        )

        template_file: str = "weekly.tex.jinja"
        jinja_env: Environment = Environment(
            loader=FileSystemLoader(searchpath=TIME_SHEETS_TEMPLATE_DIR)
        )
        jinja_env.filters.update({"format_locale": format_string, "escape_latex": escape_latex})
        template: Template = jinja_env.get_template(template_file)

        # Sort and organize entries by dates
        start_date: date = date.fromisocalendar(self.year, self.week_no, 1)
        entries_by_date: List[WeeklyTimeSheet.DayListing] = []
        self.entries.sort(key=lambda entry: datetime.combine(entry.date, entry.start_time))
        for day_offset in range(7):
            day: date = start_date + timedelta(days=day_offset)
            entries: List[TimeEntry] = list(filter(lambda entry: entry.date == day, self.entries))
            entries_by_date.append(
                WeeklyTimeSheet.DayListing(
                    day, entries, sum(entry.get_hours() for entry in entries)
                )
            )

        template.stream(
            data=self,
            days=entries_by_date,
            total_hours=sum(entry.get_hours() for entry in self.entries),
            generation_time=datetime.now(),
            footer=footer,
            hyperlink=KEINPLAN_LINK,
            version=VERSION_BACKEND,
        ).dump(str(rendered_file))
        result = self._run_latex(rendered_file, pdf_file)
        return pdf_file if result else None
