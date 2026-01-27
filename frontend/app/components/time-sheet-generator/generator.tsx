"use client";

import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { FaCalendarDay, FaEnvelopeCircleCheck, FaMagnifyingGlass, FaUser } from "react-icons/fa6";
import { CookieData, UserData } from "../../types/user-data";
import { USER_COOKIE_NAME } from "../../utils/constants";
import { addDaysToDate, getMonday } from "../../utils/dates";
import { scrollToElement } from "../../utils/viewport";
import Container from "../page/container";
import Stepper from "../stepper";
import CheckDates from "./steps/check-dates";
import DateForm from "./steps/date-form";
import ResultView from "./steps/result-view";
import FormUserData from "./steps/user-form";

const TimeSheetGenerator = () => {
  const [userData, setUserData] = useState<UserData>();

  const fiveDaysAgo = addDaysToDate(new Date(), -5);
  const [targetDate, setTargetDate] = useState<Date>(getMonday(fiveDaysAgo));
  const [kaPlanIcs, setKaPlanIcs] = useState<string>();

  const [eventList, setEventList] = useState<Event[]>();
  const updateDate = (changedEntry: Event) => {
    // TODO(Niklas): Wie neuen Termin hinzufügen?
    setEventList((date) =>
      eventList?.map((date) => (date.uid === changedEntry.uid ? changedEntry : date)),
    );
  };

  enum Steps {
    USER_FORM,
    DATE_FORM,
    CHECK_DATES,
    RESULT_VIEW,
  }
  const [step, setStep] = useState<Steps>(Steps.USER_FORM);

  // Take user data from cookie upon first render, if available
  const [cookies] = useCookies([USER_COOKIE_NAME]);
  const userCookie: CookieData = cookies[USER_COOKIE_NAME];
  useEffect(() => {
    if (userCookie) {
      setUserData({
        firstName: userCookie.firstName,
        lastName: userCookie.lastName,
        employer: userCookie.employer,
      });
      setKaPlanIcs(userCookie.kaPlanIcs);
    }
  }, []);

  // Focus on time sheet generator upon each active step change (mobile devices only)
  const enableFocusOnEachStep = useRef(false);
  useEffect(() => {
    enableFocusOnEachStep.current ||= step != Steps.USER_FORM;
    if (enableFocusOnEachStep.current) {
      scrollToElement("stepper", true);
    }
  }, [step]);

  return (
    <>
      <Container className="bg-light" id="stepper">
        <Stepper
          steps={[
            { key: Steps.USER_FORM, name: "Allgemeines", icon: FaUser },
            { key: Steps.DATE_FORM, name: "Termine", icon: FaCalendarDay },
            { key: Steps.CHECK_DATES, name: "Prüfen", icon: FaMagnifyingGlass },
            { key: Steps.RESULT_VIEW, name: "Verschicken", icon: FaEnvelopeCircleCheck },
          ]}
          active={step}
        />
      </Container>

      <Container>
        {step == Steps.USER_FORM && (
          <FormUserData
            userData={userData}
            setUserData={setUserData}
            setKaPlanIcs={setKaPlanIcs}
            nextStep={() => {
              setStep(Steps.DATE_FORM);
            }}
          />
        )}

        {step == Steps.DATE_FORM && (
          <DateForm
            userData={userData!}
            targetDate={targetDate}
            setTargetDate={setTargetDate}
            kaPlanIcs={kaPlanIcs}
            setKaPlanIcs={setKaPlanIcs}
            setDateList={setEventList}
            prevStep={() => {
              setStep(Steps.USER_FORM);
            }}
            nextStep={() => {
              setStep(Steps.CHECK_DATES);
            }}
          />
        )}

        {step == Steps.CHECK_DATES && (
          <CheckDates
            targetDate={targetDate}
            dateList={eventList!}
            updateDate={updateDate}
            prevStep={() => {
              setStep(Steps.DATE_FORM);
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
            dateList={eventList!}
            prevStep={() => {
              setStep(Steps.CHECK_DATES);
            }}
          />
        )}
      </Container>
    </>
  );
};

export default TimeSheetGenerator;
