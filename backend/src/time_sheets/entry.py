"""Time entry module for KeinPlan."""

from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Optional, Tuple


@dataclass
class TimeEntry:
    """Class for each individual time entry."""

    title: str
    role: str
    time_span: Tuple[datetime, datetime]
    break_span: Optional[Tuple[datetime, datetime]]

    def _calc_diff(
        self, span: Optional[Tuple[datetime, datetime]]
    ) -> timedelta:
        """Calculate the duration between to datetime objects."""
        return timedelta(0) if span is None else span[1] - span[0]

    def calc_hours(self, precision_h: float = 0.25) -> float:
        """Calculate the rounded total work duration in hours."""
        duration: timedelta = self._calc_diff(
            self.time_span
        ) - self._calc_diff(self.break_span)
        hours: float = duration.total_seconds() / 60 / 60
        return round(hours / precision_h) * precision_h

    def is_valid(self) -> bool:
        """Check plausibility of timestamps."""
        if self.time_span[1] < self.time_span[0]:
            return False
        if self.break_span and self.break_span[1] < self.break_span[0]:
            return False
        return True
