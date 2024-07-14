"use client";

import {
  faCalendarDay,
  faEnvelopeCircleCheck,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { USER_COOKIE_NAME } from "../../utils/constants";
import Container from "../layout/container";
import Stepper from "../stepper";
import CheckStep from "./steps/check";
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

export interface CookieData {
  userData: UserData;
  timeSheetParams: TimeSheetParams;
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
    USER_DATA,
    TIME_SHEET_DATA,
    DATE_CHECK,
    RESULT_VIEW,
  }
  const [step, setStep] = useState<Steps>(Steps.USER_DATA);

  // Take user data from cookie upon first render, if available
  const [cookies] = useCookies([USER_COOKIE_NAME]);
  const userCookie = cookies[USER_COOKIE_NAME];
  useEffect(() => {
    if (userCookie) {
      setUserData(userCookie.userData);
      const params: TimeSheetParams = {
        ...userCookie.timeSheetParams,
        targetDate: new Date(Date.parse(userCookie.timeSheetParams.targetDate)),
      };
      setTimeSheetParams(params);
    }
  }, []);

  return (
    <>
      <Container className="bg-light">
        <Stepper
          steps={[
            { key: Steps.USER_DATA, name: "Allgemeines", icon: faUser },
            { key: Steps.TIME_SHEET_DATA, name: "Termine", icon: faCalendarDay },
            { key: Steps.DATE_CHECK, name: "Prüfen", icon: faMagnifyingGlass },
            { key: Steps.RESULT_VIEW, name: "Verschicken", icon: faEnvelopeCircleCheck },
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
            setDateList={setDateList}
            prevStep={() => {
              setStep(Steps.USER_DATA);
            }}
            nextStep={() => {
              setStep(Steps.DATE_CHECK);
            }}
          />
        )}

        {step == Steps.DATE_CHECK && (
          <CheckStep
            userData={userData!}
            timeSheetParams={timeSheetParams!}
            dateList={dateList!}
            prevStep={() => {
              setStep(Steps.TIME_SHEET_DATA);
            }}
            nextStep={() => {
              setStep(Steps.RESULT_VIEW);
            }}
          />
        )}

        {step == Steps.RESULT_VIEW && (
          <ResultView
            userData={userData!}
            timeSheetParams={timeSheetParams!}
            dateList={dateList!}
            prevStep={() => {
              setStep(Steps.DATE_CHECK);
            }}
          />
        )}
      </Container>
    </>
  );
};

export default TimeSheetGenerator;
