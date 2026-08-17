"use client";

import {
  faCalendarDay,
  faEnvelopeCircleCheck,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { USER_COOKIE_NAME } from "../../utils/constants";
import { addDaysToDate, getMonday } from "../../utils/dates";
import { scrollToElement } from "../../utils/viewport";
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

export interface CookieData extends UserData {
  kaPlanIcs: string;
}

export interface DateEntry {
  uid: string;
  title: string;
  role: string;
  location: string;
  start_date: Date;
  end_date: Date;
}

enum Steps {
  USER_DATA = 0,
  TIME_SHEET_DATA = 1,
  DATE_CHECK = 2,
  RESULT_VIEW = 3,
}

const TimeSheetGenerator = () => {
  const fiveDaysAgo = addDaysToDate(new Date(), -5);
  const [targetDate, setTargetDate] = useState<Date>(getMonday(fiveDaysAgo));

  const [dateList, setDateList] = useState<DateEntry[]>();

  const [step, setStep] = useState<Steps>(Steps.USER_DATA);

  // Take user data from cookie upon first render, if available
  const [cookies] = useCookies([USER_COOKIE_NAME]);
  const userCookie: CookieData | undefined = cookies[USER_COOKIE_NAME];

  const initialUserData = userCookie
    ? {
        firstName: userCookie.firstName,
        lastName: userCookie.lastName,
        employer: userCookie.employer,
      }
    : undefined;

  const initialKaPlanIcs = userCookie?.kaPlanIcs;

  const [userData, setUserData] = useState<UserData | undefined>(initialUserData);
  const [kaPlanIcs, setKaPlanIcs] = useState<string | undefined>(initialKaPlanIcs);

  // Focus on time sheet generator upon each active step change (mobile devices only)
  const enableFocusOnEachStep = useRef(false);
  useEffect(() => {
    enableFocusOnEachStep.current ||= step !== Steps.USER_DATA;
    if (enableFocusOnEachStep.current) {
      scrollToElement("stepper", true);
    }
  }, [step]);

  return (
    <>
      <Container className="bg-light" id="stepper">
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
            setKaPlanIcs={setKaPlanIcs}
            nextStep={() => {
              setStep(Steps.TIME_SHEET_DATA);
            }}
          />
        )}

        {step == Steps.TIME_SHEET_DATA && (
          <DatesStep
            userData={userData!}
            targetDate={targetDate}
            setTargetDate={setTargetDate}
            kaPlanIcs={kaPlanIcs}
            setKaPlanIcs={setKaPlanIcs}
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
            targetDate={targetDate}
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
            targetDate={targetDate!}
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
