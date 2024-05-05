import { useState } from "react";

import { TimeSheetData, TimeSheetDate, UserData } from "./common";
import FormDates from "./form-dates";
import FormUserData from "./form-user-data";
import ResultView from "./result-view";

const TimeSheetGenerator = () => {
  const [userData, setUserData] = useState<UserData>();
  const [timeSheetData, setTimeSheetData] = useState<TimeSheetData>();
  const [dateList, setDateList] = useState<TimeSheetDate[]>();

  enum Steps {
    FORM_USER_DATA,
    FORM_DATES,
    RESULT_VIEW,
  }
  const [step, setStep] = useState<Steps>(Steps.FORM_USER_DATA);

  switch (step) {
    case Steps.FORM_USER_DATA:
      return (
        <FormUserData
          userData={userData}
          setUserData={setUserData}
          nextStep={() => {
            setStep(Steps.FORM_DATES);
          }}
        />
      );

    case Steps.FORM_DATES:
      return (
        <FormDates
          timeSheetData={timeSheetData}
          setTimeSheetData={setTimeSheetData}
          dateList={dateList}
          setDateList={setDateList}
          prevStep={() => {
            setStep(Steps.FORM_USER_DATA);
          }}
          nextStep={() => {
            setStep(Steps.RESULT_VIEW);
          }}
        />
      );

    case Steps.RESULT_VIEW:
      return (
        <ResultView
          userData={userData}
          timeSheetData={timeSheetData}
          dateList={dateList}
          prevStep={() => {
            setStep(Steps.FORM_DATES);
          }}
        />
      );
  }
};

export default TimeSheetGenerator;
