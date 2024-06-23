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
    const isPassed = props.active > step.key;
    const isActive = props.active == step.key;
    return (
      <li
        className={isActive && "active"}
        title={`${index + 1}. Schritt: ${step.name}`}
        key={index}
      >
        <div className="fw-bold fs-6">
          <div
            className={`rounded-circle p-1 ${isActive || isPassed ? "bg-primary text-white" : "border bg-light text-muted"}`}
            style={{ width: "2.1rem", height: "2.1rem" }}
          >
            {step.icon ? <FontAwesomeIcon icon={step.icon} size="1x" /> : <>{index + 1}</>}
          </div>
        </div>
        <span
          className={`d-none d-sm-block small ${isActive ? "text-primary fw-bold" : isPassed ? "text-primary" : "text-secondary"}`}
        >
          {step.name}
        </span>
      </li>
    );
  };

  return (
    <ol className="stepper py-3 px-5">
      {props.steps.map((step, index) => renderStep(step, index))}
    </ol>
  );
};

export default Stepper;
