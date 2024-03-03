import { useEffect, useState } from "react";

import { TimeSheetDate, TimeSheetParams, UserData } from "./common";
import TSDateCheck from "./step-date-check";
import TSParamInput from "./step-param-input";
import { useCookies } from "react-cookie";
import { KEINPLAN_PARAMS_COOKIE } from "../../utils/constants";

const TimeSheetGenerator = () => {
  // Apply saved values upon initial rendering
  const [cookies] = useCookies()
  const getInitialParams = ():TimeSheetParams => {
    return {
      firstName: cookies.userData?.firstName ?? "",
      lastName: cookies.userData?.lastName ?? "",
      employer: cookies.userData?.employer ?? "",
      kaPlanIcs: cookies.userData?.kaPlanIcs ?? "",
      dateInTargetWeek: new Date()
    }
  }

  const [params, setParams] = useState<TimeSheetParams>(getInitialParams)
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
