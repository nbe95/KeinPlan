export type TimeSheetParams = {
  firstName: string;
  lastName: string;
  employer: string;
  dateInTargetWeek: Date;
  kaPlanIcs: string;
};

export type TimeSheetDate = {
  title: string;
  role: string;
  location: string;
  begin: Date;
  end: Date;
  breakBegin: Date;
  breakEnd: Date;
};
