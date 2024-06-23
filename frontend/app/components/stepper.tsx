import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Step = {
  key: number;
  name: string;
  icon?: IconProp;
};
type StepperProps = {
  steps: Array<Step>;
  active: number;
};

export const Stepper = (props: StepperProps) => {
  const renderStep = (step: Step, index: number) => {
        const isPassed = props.active >= step.key;
        const isActive = props.active == step.key;
        return (
          <li className={isPassed && "passed"} key={index}>
            <div className="mx-auto text-muted fw-bold fs-6">
              <div
                className={`rounded-circle p-2 border ${isPassed ? "border-primary bg-primary text-white" : "border-secondary bg-light text-muted"}`}
                style={{ width: "2.6rem", height: "2.6rem" }}
              >
                {step.icon ? <FontAwesomeIcon icon={step.icon} /> : <>{index + 1}</>}
              </div>
            </div>
            <p className={`my-2 ${isActive ? "text-primary fw-bold" : (isPassed ? "text-dark" : "text-muted")}`}>{step.name}</p>
          </li>
        );
  }

  return (
    <ol className="stepper py-3">
      {props.steps.map((step, index) => renderStep(step, index))}
    </ol>
  );
};

export default Stepper;
