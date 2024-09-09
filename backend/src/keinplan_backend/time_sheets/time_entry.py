"""Time entry module for KeinPlan."""

from dataclasses import dataclass
from datetime import date, datetime, time, timedelta
from typing import Optional


@dataclass(frozen=True)
class TimeEntry:
    """Class for each individual time entry."""

    uid: Optional[str]
    title: str
    role: str
    location: str
    date: date
    start_time: time
    end_time: time

    def get_hours(self, precision_h: float = 0.25) -> float:
        """Get the rounded duration in hours."""
        duration: timedelta = datetime.combine(date.min, self.end_time) - datetime.combine(
            date.min, self.start_time
        )
        hours: float = duration.total_seconds() / 60 / 60
        return round(hours / precision_h) * precision_h

    @property
    def is_valid(self) -> bool:
        """Check plausibility of involved timestamps."""
        return self.start_time <= self.end_time
