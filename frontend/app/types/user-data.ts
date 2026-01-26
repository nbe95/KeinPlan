export interface UserData {
  firstName: string;
  lastName: string;
  employer: string;
}

export interface CookieData extends UserData {
  kaPlanIcs: string;
}
