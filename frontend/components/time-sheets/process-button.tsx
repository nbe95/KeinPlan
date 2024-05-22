import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren } from "react";
import { Button } from "react-bootstrap";

interface ButtonProps {
  type?: "button" | "submit";
  disabled?: boolean;
  callback?: () => void;
}

interface ButtonPropsInt extends ButtonProps {
  variant: string;
}

const StepButton = (props: PropsWithChildren<ButtonPropsInt>) => {
  return (
    <Button
      variant={props.variant}
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={() => {
        props.callback && props.callback();
      }}
      className="px-4"
    >
      {props.children}
    </Button>
  );
};

export const NextButton = (props: ButtonProps) => {
  return (
    <StepButton variant="primary" {...props}>
      <span>Weiter</span>
      <FontAwesomeIcon icon={faChevronRight} className="ms-2" />
    </StepButton>
  );
};

export const PrevButton = (props: ButtonProps) => {
  return (
    <StepButton variant="secondary" {...props}>
      <FontAwesomeIcon icon={faChevronLeft} className="me-2" />
      <span>Zurück</span>
    </StepButton>
  );
};
