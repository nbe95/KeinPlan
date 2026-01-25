import { PropsWithChildren } from "react";
import { Button } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface ButtonProps {
  submit?: boolean;
  disabled?: boolean;
  id?: string;
  callback?: () => void;
}

interface ButtonPropsInt extends ButtonProps {
  variant: string;
}

const StepButton = (props: PropsWithChildren<ButtonPropsInt>) => {
  return (
    <Button
      type={props.submit ? "submit" : "button"}
      variant={props.variant}
      disabled={props.disabled}
      id={props.id}
      onClick={() => {
        props.callback && props.callback();
      }}
      className="px-4 d-flex align-items-center justify-content-center"
    >
      {props.children}
    </Button>
  );
};

export const NextButton = (props: ButtonProps) => {
  return (
    <StepButton variant="primary" {...props}>
      <span>Weiter</span>
      <FaChevronRight size="1.2em" className="ms-2" />
    </StepButton>
  );
};

export const PrevButton = (props: ButtonProps) => {
  return (
    <StepButton variant="secondary" {...props}>
      <FaChevronLeft size="1.2em" className="me-2" />
      <span>Zurück</span>
    </StepButton>
  );
};
