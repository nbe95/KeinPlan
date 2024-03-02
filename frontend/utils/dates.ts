export const getMonday = (dateInWeek: Date) => {
  const date: Date = new Date(dateInWeek);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date;
};

export const addDaysToDate = (refDate: Date, daysToAdd: number) => {
  let result: Date = new Date(refDate);
  result.setDate(result.getDate() + daysToAdd);
  return result;
};

export const getDateString = (date: Date) => {
  return [
    date.getFullYear().toString().padStart(4, "0"),
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getDate().toString().padStart(2, "0"),
  ].join("-");
};

// This following script is released to the public domain and may be used,
// modified and distributed without restrictions. Attribution not necessary but
// appreciated.
// Source: https://weeknumber.com/how-to/javascript

// Returns the ISO week of the date.
export const getWeek = (date: Date) => {
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
export const getWeekYear = (date: Date) => {
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  return date.getFullYear();
};
function strftime(arg0: string) {
  throw new Error("Function not implemented.");
}
