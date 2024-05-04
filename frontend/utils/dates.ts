export const getMonday = (dateInWeek: Date): Date => {
  const date: Date = new Date(dateInWeek);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date;
};

export const addDaysToDate = (refDate: Date, daysToAdd: number): Date => {
  let result: Date = new Date(refDate);
  result.setDate(result.getDate() + daysToAdd);
  return result;
};

export const getDateString = (date: Date): string => {
  return [
    date.getFullYear().toString().padStart(4, "0"),
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getDate().toString().padStart(2, "0"),
  ].join("-");
};

export const parseDateStr = (date: string): Date | null => {
  let result: Date | null = new Date();
  let parsed = Date.parse(date);
  if (isNaN(parsed)) return null;

  result.setTime(Date.parse(date));
  return result;
};

// This following script is released to the public domain and may be used,
// modified and distributed without restrictions. Attribution not necessary but
// appreciated.
// Source: https://weeknumber.com/how-to/javascript

// Returns the ISO week of the date.
export const getWeek = (date: Date): number => {
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    )
  );
};

// Returns the four-digit year corresponding to the ISO week of the date.
export const getWeekYear = (date: Date): number => {
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  return date.getFullYear();
};
