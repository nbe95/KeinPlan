import { useState } from "react";
import PageSection from "../components/page-section";
import PageWrapper from "../components/page-wrapper";
import { TimeSheetDate, TimeSheetParams, UserData } from "./components/common";
import FormDates from "./components/form-dates";
import FormUserData from "./components/form-user-data";
import ResultView from "./components/result-view";

const Page = () => {
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
    <PageWrapper title="Stundenliste">
      <PageSection headline="Stundenliste erstellen">
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
      </PageSection>
    </PageWrapper>
  );
};

export default Page;
