export type TSParams = {
  firstName: string;
  lastName: string;
  employer: string;
  targetDate: Date;
  kaPlanIcs: string;
};

export enum TSSteps {
  ParamInput,
  DateCheck,
  Download,
}
