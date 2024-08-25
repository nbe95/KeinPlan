"""Time span module for KeinPlan."""

from dataclasses import dataclass
from datetime import datetime, timedelta


@dataclass(frozen=True)
class TimeSpan:
    """Helper class holding both the begin and end of an event."""

    begin: datetime
    end: datetime

    def get_duration(self) -> timedelta:
        """Calculate the duration of the time span."""
        return self.end - self.begin

    def is_valid(self) -> bool:
        """Check if timestamps are plausible."""
        return self.end > self.begin
