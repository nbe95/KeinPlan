"""Time sheet module for KeinPlan."""

from abc import abstractmethod
from pathlib import Path
from subprocess import CompletedProcess, run
from typing import List, Tuple

from time_entry import TimeEntry


class TimeSheet:
    """Base class for all kinds of time sheets."""

    def __init__(self, employer: str, employee: str) -> None:
        self.employer: str = employer
        self.employee: str = employee
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
        self, employer: str, employee: str, week_no: int, year: int
    ) -> None:
        super().__init__(employer, employee)
        self.week_no: int = week_no
        self.year: int = year

    def generate(self, target_file: Path) -> bool:
        """Generate a PDF time sheet from the given data."""
        template_file: str = "./templates/weekly_time_sheet.jinja.md"
        # TODO: Jinja magic

        with open(template_file, "r", encoding="utf-8") as fh_template:
            return self._convert_md_to_pdf(fh_template.read(), target_file)
