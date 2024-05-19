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
  begin: Date;
  end: Date;
  breakBegin?: Date;
  breakEnd?: Date;
}
