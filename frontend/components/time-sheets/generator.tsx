import { useState } from "react";

import { TimeSheetData, TimeSheetDate, UserData } from "./common";
import FormTimeSheetData from "./form-time-sheet-data";
import FormUserData from "./form-user-data";

const TimeSheetGenerator = () => {
  const [userData, setUserData] = useState<UserData>();
  const [timeSheetData, setTimeSheetData] = useState<TimeSheetData>();
  const [dateList, setDateList] = useState<TimeSheetDate[]>();

  enum Steps {
    USER_DATA,
    TIME_SHEET_DATA,
  }
  const [step, setStep] = useState<Steps>(Steps.USER_DATA);

  switch (step) {
    case Steps.USER_DATA:
      return (
        <FormUserData
          userData={userData}
          setUserData={setUserData}
          nextStep={() => {
            setStep(Steps.TIME_SHEET_DATA);
          }}
        />
      );
    case Steps.TIME_SHEET_DATA:
      return (
        <FormTimeSheetData
          timeSheetData={timeSheetData}
          setTimeSheetData={setTimeSheetData}
          dateList={dateList}
          setDateList={setDateList}
          prevStep={() => {
            setStep(Steps.USER_DATA);
          }}
        />
      );
  }
};

export default TimeSheetGenerator;
