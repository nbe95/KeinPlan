"""Main module for KeinPlan backend."""

from datetime import date, time
from pathlib import Path

from time_entry import TimeEntry
from time_sheet import TimeSheet, WeeklyTimeSheet


def main():
    """Run main entry point."""
    ts: TimeSheet = WeeklyTimeSheet("Dienstgeber", "Mitarbeiter", 2023, 50)
    ts.entries = [
        TimeEntry(
            date(2023, 12, 11),
            "Hl. Messe",
            (time(11, 0), time(12, 0)),
            None,
        ),
        TimeEntry(
            date(2023, 12, 12),
            "Hl. Messe",
            (time(11, 0), time(12, 0)),
            None,
        ),
        TimeEntry(
            date(2023, 12, 13),
            "Hl. Messe",
            (time(11, 0), time(12, 0)),
            None,
        ),
        TimeEntry(
            date(2023, 12, 14),
            "Hl. Messe",
            (time(11, 0), time(12, 0)),
            None,
        ),
        TimeEntry(
            date(2023, 12, 15),
            "Bußandacht",
            (time(11, 0), time(12, 0)),
            None,
        ),
    ]
    ts.generate(Path("out/out.pdf"))


if __name__ == "__main__":
    main()