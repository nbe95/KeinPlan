export interface UserData {
  firstName: string
  lastName: string
  employer: string
  kaPlanIcs: string
};

export interface TimeSheetParams extends UserData {
  dateInTargetWeek: Date
}

export interface TimeSheetDate {
  title: string
  role: string
  location: string
  begin: Date
  end: Date
  breakBegin: Date
  breakEnd: Date
};
