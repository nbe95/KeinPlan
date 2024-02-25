import { useState } from "react";

import { TSParams, TSSteps } from "./common";
import TSDateCheck from "./step-date-check";
import TSParamInput from "./step-param-input";

const TimeSheetGenerator = () => {
  const [params, setParams] = useState<TSParams>();
  const [step, setStep] = useState<TSSteps>(TSSteps.ParamInput);

  return (
    <>
      {step == TSSteps.ParamInput && (
        <TSParamInput
          setParams={setParams}
          nextStep={() => setStep(TSSteps.DateCheck)}
        />
      )}

      {step == TSSteps.DateCheck && (
        <TSDateCheck
          params={params}
          prevStep={() => setStep(TSSteps.ParamInput)}
          nextStep={() => setStep(TSSteps.Download)}
        />
      )}

      {step == TSSteps.Download && <></>}
    </>
  );
};

export default TimeSheetGenerator;
