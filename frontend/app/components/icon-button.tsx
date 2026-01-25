import { PropsWithChildren } from "react";
import { ButtonProps as BootstrapButtonProps, Button } from "react-bootstrap";
import { IconType } from "react-icons";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface IconButtonProps extends BootstrapButtonProps {
  icon: IconType;
  iconPos?: "left" | "right";
}

export const IconButton = (props: PropsWithChildren<IconButtonProps>) => {
  const combinedClassName =
    `px-4 d-flex align-items-center justify-content-center ${props.className || ""}`.trim();
  return (
    <Button {...props} className={combinedClassName}>
      {props.iconPos != "right" && <props.icon size="1em" className="me-2" />}
      {props.children}
      {props.iconPos == "right" && <props.icon size="1em" className="ms-2" />}
    </Button>
  );
};

export const IconButtonNext = (props: BootstrapButtonProps) => (
  <IconButton variant="primary" {...props} icon={FaChevronRight} iconPos="right">
    Weiter
  </IconButton>
);

export const IconButtonPrev = (props: BootstrapButtonProps) => (
  <IconButton variant="secondary" {...props} icon={FaChevronLeft} iconPos="left">
    Zurück
  </IconButton>
);
