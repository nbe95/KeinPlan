import strftime from "strftime";

export const getMonday = (dateInWeek: Date | undefined): Date => {
  const date: Date = dateInWeek ? new Date(dateInWeek) : new Date();
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date;
};

export const addDaysToDate = (refDate: Date, daysToAdd: number): Date => {
  let date: Date = new Date(refDate);
  date.setDate(date.getDate() + daysToAdd);
  return date;
};

export const parseDateStr = (date: string): Date => {
  let result: Date = new Date(0);
  let parsed = Date.parse(date);
  if (!isNaN(parsed)) result.setTime(parsed);
  return result;
};

// This following script is released to the public domain and may be used,
// modified and distributed without restrictions. Attribution not necessary but
// appreciated.
// Source: https://weeknumber.com/how-to/javascript

// Returns the ISO week of the date.
export const getIsoWeek = (refDate: Date): number => {
  let date: Date = new Date(refDate);
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  );
};

// Returns the four-digit year corresponding to the ISO week of the date.
// Note: This function is necessary for e.g. 01/01/2023 = ISO week 52/2022
export const getIsoYear = (refDate: Date): number => {
  let date: Date = new Date(refDate);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  return date.getFullYear();
};

export const getIsoWeekAndYear = (date: Date, separator: string = "/"): string =>
  `${getIsoWeek(date)}${separator}${getIsoYear(date)}`;

// Recursively convert all Date objects in a dictionary to ISO strings while keeping their timezone
export const dictConvertDatesToIsoString = (dict: {
  [key: string]: any;
}): { [key: string]: any } => {
  let result: { [key: string]: any } = {}; // Create a mutable clone not manipulating the original object
  Object.assign(result, dict);
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (value.constructor == Object) {
      // check for sub-dictionaries
      result[key] = dictConvertDatesToIsoString(value);
    } else if (value instanceof Date) {
      result[key] = strftime("%Y-%m-%dT%H:%M:%S%z", value);
    }
  });
  return result;
};

export const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
