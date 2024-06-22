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
  return (
    <ol className="stepper py-3">
      {props.steps.map((step, index) => {
        const isActive = props.active >= step.key;
        return (
          <li className={isActive && "active"} key={index}>
            <div className="mx-auto text-muted fw-bold fs-6">
              <div
                className={`rounded-circle p-2 border ${isActive ? "border-primary bg-primary text-white" : "border-secondary bg-light text-muted"}`}
                style={{ width: "2.6rem", height: "2.6rem" }}
              >
                {step.icon ? <FontAwesomeIcon icon={step.icon} /> : <>{index + 1}</>}
              </div>
            </div>
            <p className={`my-2 ${isActive ? "text-dark" : "text-muted"}`}>{step.name}</p>
          </li>
        );
      })}{" "}
    </ol>
  );
};

export default Stepper;
