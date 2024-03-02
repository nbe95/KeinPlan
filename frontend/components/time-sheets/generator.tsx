import { useState } from "react";

import { TimeSheetDate, TimeSheetParams } from "./common";
import TSDateCheck from "./step-date-check";
import TSParamInput from "./step-param-input";

const TimeSheetGenerator = () => {
  const [params, setParams] = useState<TimeSheetParams>();
  const [dateList, setDateList] = useState<TimeSheetDate[]>();

  return (
    <>
      {!dateList ? ( // Step 1
        <TSParamInput
          params={params}
          setParams={setParams}
          setDateList={setDateList}
        />
      ) : true ? ( // Step 2
        <TSDateCheck dateList={dateList} setDateList={setDateList} />
      ) : (
        // Step 3
        <>foo</>
      )}
    </>
  );
};

export default TimeSheetGenerator;
