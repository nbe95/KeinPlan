export interface UserData {
  firstName: string;
  lastName: string;
  employer: string;
}

export type TimeSheetType = "weekly";
export type TimeSheetFormat = "pdf";

export interface TimeSheetParams {
  type: TimeSheetType;
  format: TimeSheetFormat;
  targetDate: Date;
  kaPlanIcs: string;
}

export interface TimeSheetDate {
  title: string;
  role: string;
  location: string;
  time: { begin: Date, end: Date };
  break?: { begin: Date, end: Date };
}
