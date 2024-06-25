import {
  IconDefinition,
  faCircleExclamation,
  faCircleInfo,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren } from "react";
import { Alert, Stack } from "react-bootstrap";

type MsgBoxType = "error" | "warning" | "info";

type MsgBoxProps = {
  type: MsgBoxType;
  trace?: string;
};

const MsgBox = (props: PropsWithChildren<MsgBoxProps>) => {
  const styling: Record<MsgBoxType, { bsVariant: string; faIcon: IconDefinition }> = {
    error: { bsVariant: "danger", faIcon: faTriangleExclamation },
    warning: { bsVariant: "warning", faIcon: faCircleExclamation },
    info: { bsVariant: "info", faIcon: faCircleInfo },
  };

  return (
    <Alert variant={styling[props.type].bsVariant} className="my-4">
      <Stack direction="horizontal" gap={4}>
        <FontAwesomeIcon icon={styling[props.type].faIcon} size="3x" />
        <div>
          {props.children}
          {props.trace && (
            <>
              <br />
              <code>{props.trace}</code>
            </>
          )}
        </div>
      </Stack>
    </Alert>
  );
};

export default MsgBox;
