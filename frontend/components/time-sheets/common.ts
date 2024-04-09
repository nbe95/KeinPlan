export interface UserData {
  firstName: string
  lastName: string
  employer: string
};

export type TimeSheetType = "weekly"
export interface TimeSheetData {
  type: TimeSheetType
  targetDate: Date
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

export interface KaPlanData {
  icsString: string
  dates: Array<TimeSheetDate>
}

// TODO: Diese Interfaces im Code umsetzen
