"use client";

import {
  faCalendarDay,
  faCheck,
  faClipboardUser,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Stepper from "../stepper";
import FormDates from "./form-dates";
import FormUserData from "./form-user-data";
import ResultView from "./result-view";

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
  time: { begin: Date; end: Date };
  break?: { begin: Date; end: Date };
}

const TimeSheetGenerator = () => {
  const [userData, setUserData] = useState<UserData>();
  const [timeSheetParams, setTimeSheetParams] = useState<TimeSheetParams>();
  const [dateList, setDateList] = useState<TimeSheetDate[]>();

  enum Steps {
    FORM_USER_DATA,
    FORM_DATES,
    RESULT_VIEW,
  }
  const [step, setStep] = useState<Steps>(Steps.FORM_USER_DATA);

  return (
    <>
      <div className="mb-4 border-bottom">
        <Stepper
          steps={[
            { key: Steps.FORM_USER_DATA, name: "Allgemeines", icon: faClipboardUser },
            { key: Steps.FORM_DATES, name: "Termine", icon: faCalendarDay },
            { key: Steps.FORM_DATES, name: "Prüfen", icon: faMagnifyingGlass },
            { key: Steps.RESULT_VIEW, name: "Fertig", icon: faCheck },
          ]}
          active={step}
        />
      </div>

      {step == Steps.FORM_USER_DATA && (
        <FormUserData
          userData={userData}
          setUserData={setUserData}
          nextStep={() => {
            setStep(Steps.FORM_DATES);
          }}
        />
      )}

      {step == Steps.FORM_DATES && (
        <FormDates
          timeSheetParams={timeSheetParams}
          setTimeSheetParams={setTimeSheetParams}
          dateList={dateList}
          setDateList={setDateList}
          prevStep={() => {
            setStep(Steps.FORM_USER_DATA);
          }}
          nextStep={() => {
            setStep(Steps.RESULT_VIEW);
          }}
        />
      )}
      {step == Steps.RESULT_VIEW && (
        <ResultView
          userData={userData}
          timeSheetParams={timeSheetParams}
          dateList={dateList}
          prevStep={() => {
            setStep(Steps.FORM_DATES);
          }}
        />
      )}
    </>
  );
};

export default TimeSheetGenerator;
