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

    @abstractmethod
    def generate_pdf(self, target_file: Path) -> bool:
        """Generate a PDF time sheet from the given data."""


class WeeklyTimeSheet(TimeSheet):
    """Time sheet based on calendar weeks."""

    def __init__(
        self, employer: str, employee: str, week_no: int, year: int
    ) -> None:
        super().__init__(employer, employee)
        self.week_no: int = week_no
        self.year: int = year

    def generate_pdf(self, target_file: Path) -> bool:
        """Generate a PDF time sheet from the given data."""
        template_file: str = "./templates/weekly_time_sheet.jinja.md"
        # TODO: Jinja magic

        cmd: Tuple[str, ...] = (
            "pandoc",
            "-o",
            str(target_file),
            template_file,
        )
        result: CompletedProcess = run(cmd, check=True)
        return result.returncode == 0
