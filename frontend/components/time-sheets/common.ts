export type TimeSheetParams = {
  firstName: string;
  lastName: string;
  employer: string;
  targetDate: Date;
  kaPlanIcs: string;
};

export type TimeSheetDate = {
  title: string;
  role: string;
  location: string;
  begin: Date;
  end: Date;
  break_begin: Date;
  break_end: Date;
};
