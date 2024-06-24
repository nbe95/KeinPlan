"use client";

import {
  faCalendarDay,
  faCheck,
  faClipboardUser,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Container from "../layout/container";
import Stepper from "../stepper";
import DatesStep from "./steps/dates";
import ResultView from "./steps/result";
import FormUserData from "./steps/user-data";

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
      <Container className="bg-light">
        <Stepper
          steps={[
            { key: Steps.FORM_USER_DATA, name: "Allgemeines", icon: faClipboardUser },
            { key: Steps.FORM_DATES, name: "Termine", icon: faCalendarDay },
            { key: Steps.FORM_DATES, name: "Prüfen", icon: faMagnifyingGlass },
            { key: Steps.RESULT_VIEW, name: "Fertig", icon: faCheck },
          ]}
          active={step}
        />
      </Container>

      <Container>
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
          <DatesStep
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
      </Container>
    </>
  );
};

export default TimeSheetGenerator;
