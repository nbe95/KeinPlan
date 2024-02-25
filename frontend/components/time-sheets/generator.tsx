import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { API_BASE_URL } from "../../constants";

import { TSParams, TSSteps } from "./common";
import TSDataInput from "./step-param-input";

const TimeSheetGenerator = () => {
  const [params, setParams] = useState<TSParams>();
  const [step, setStep] = useState<TSSteps>(TSSteps.ParamInput);

  const kaPlanQuery = useQuery({
    queryKey: ["kaPlan"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/kaplan/`);
      if (!response.ok) {
        return "error";
      }
      return await response.json();
    },
    enabled: step == TSSteps.DateCheck,
  });

  return (
    <>
      {step == TSSteps.ParamInput && (
        <TSDataInput
          setParams={setParams}
          nextStep={() => setStep(TSSteps.DateCheck)}
        />
      )}
      {step == TSSteps.DateCheck && <></>}
      {step == TSSteps.Download && <></>}
    </>
  );
};

export default TimeSheetGenerator;
