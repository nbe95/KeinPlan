import { useState } from "react";

import { TimeSheetDate, TimeSheetParams, GeneralData } from "./common";
import StepKaPlanData from "./step-kaplan-data";
import TSUserData from "./step-user-data";

const TimeSheetGenerator = () => {

   const [userData, setUserData] = useState<GeneralData>();
   const [kaPlanData, setKaPlanData] = useState<KaPlanData>();

  const [params, setParams] = useState<TimeSheetParams>()
  const [dateList, setDateList] = useState<TimeSheetDate[]>();

  const isStep1: boolean = params && params.firstName && params.lastName && params.employer && true;
  const isStep2: boolean = !!dateList;

  return (
    <>
      {isStep1 ? (
        <TSUserData
          params={params}
          setParams={setParams}
          setDateList={setDateList}
        />
      ) : isStep2 ? (
        <StepKaPlanData dateList={dateList} setDateList={setDateList} />
      ) : (
        // Step 3
        <>foo</>
      )}
    </>
  );
};

export default TimeSheetGenerator;
