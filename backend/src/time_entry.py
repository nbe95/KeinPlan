"""Time entry module for KeinPlan."""

from dataclasses import dataclass
from datetime import date, time, timedelta
from typing import Optional, Tuple


@dataclass
class TimeEntry:
    """Class for each individual time entry."""

    date: date
    occasion: str
    time_span: Tuple[time, time]
    break_span: Optional[Tuple[time, time]]

    def _calc_diff(self, span: Optional[Tuple[time, time]]) -> timedelta:
        """Calculate the duration between to time objects."""
        return timedelta(0) if span is None else abs(span[1] - span[0])

    def calc_hours(self, precision_h: float = 0.25) -> float:
        """Calculate the rounded total work duration in hours."""
        duration: timedelta = self._calc_diff(
            self.time_span
        ) - self._calc_diff(self.break_span)
        hours: float = duration.total_seconds / 60 / 60
        return round(hours / precision_h) * precision_h
