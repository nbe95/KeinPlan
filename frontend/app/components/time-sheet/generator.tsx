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
  const [userData, setUserData] = useState<UserData>({ firstName: "", lastName: "", employer: "" });
  const [timeSheetParams, setTimeSheetParams] = useState<TimeSheetParams>({
    kaPlanIcs: "",
    targetDate: new Date(0),
    type: "weekly",
    format: "pdf",
  });
  const [dateList, setDateList] = useState<TimeSheetDate[]>([]);

  enum Steps {
    USER_DATA,
    TIME_SHEET_DATA,
    DATE_CHECK,
    RESULT_VIEW,
  }
  const [step, setStep] = useState<Steps>(Steps.USER_DATA);

  return (
    <>
      <Container className="bg-light">
        <Stepper
          steps={[
            { key: Steps.USER_DATA, name: "Allgemeines", icon: faClipboardUser },
            { key: Steps.TIME_SHEET_DATA, name: "Termine", icon: faCalendarDay },
            { key: Steps.DATE_CHECK, name: "Prüfen", icon: faMagnifyingGlass },
            { key: Steps.RESULT_VIEW, name: "Fertig", icon: faCheck },
          ]}
          active={step}
        />
      </Container>

      <Container>
        {step == Steps.USER_DATA && (
          <FormUserData
            userData={userData}
            setUserData={setUserData}
            nextStep={() => {
              setStep(Steps.TIME_SHEET_DATA);
            }}
          />
        )}

        {step == Steps.TIME_SHEET_DATA && (
          <DatesStep
            timeSheetParams={timeSheetParams}
            setTimeSheetParams={setTimeSheetParams}
            dateList={dateList}
            setDateList={setDateList}
            prevStep={() => {
              setStep(Steps.USER_DATA);
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
              setStep(Steps.TIME_SHEET_DATA);
            }}
          />
        )}
      </Container>
    </>
  );
};

export default TimeSheetGenerator;
