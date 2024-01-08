"""Time entry module for KeinPlan."""

from dataclasses import dataclass
from datetime import timedelta
from typing import Optional

from .span import TimeSpan


@dataclass(frozen=True)
class TimeEntry:
    """Class for each individual time entry."""

    title: str
    role: str
    time_span: TimeSpan
    break_span: Optional[TimeSpan]

    def calc_hours(self, precision_h: float = 0.25) -> float:
        """Calculate the rounded total work duration in hours."""
        duration: timedelta = self.time_span.get_duration()
        if self.break_span:
            duration -= self.break_span.get_duration()

        hours: float = duration.total_seconds() / 60 / 60
        return round(hours / precision_h) * precision_h

    def is_valid(self) -> bool:
        """Check plausibility of timestamps."""
        if not self.time_span.is_valid():
            return False

        if self.break_span:
            if not self.break_span.is_valid():
                return False
            if (
                self.break_span.begin < self.time_span.begin
                or self.break_span.end > self.time_span.end
            ):
                return False
        return True
