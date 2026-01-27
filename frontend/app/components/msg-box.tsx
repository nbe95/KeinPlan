import { PropsWithChildren } from "react";
import { Alert, Stack } from "react-bootstrap";
import { IconType } from "react-icons";
import { FaCircleExclamation, FaCircleInfo, FaTriangleExclamation } from "react-icons/fa6";
import { match } from "ts-pattern";

type MsgBoxType = "error" | "warning" | "info";

type MsgBoxProps = {
  type: MsgBoxType;
  trace?: string;
};

const MsgBox = (props: PropsWithChildren<MsgBoxProps>) => {
  const bsVariant: string = match(props.type)
    .with("error", () => "danger")
    .with("warning", () => "warning")
    .with("info", () => "info")
    .exhaustive();

  const Icon: IconType = match(props.type)
    .with("error", () => FaTriangleExclamation)
    .with("warning", () => FaCircleExclamation)
    .with("info", () => FaCircleInfo)
    .exhaustive();

  return (
    <Alert variant={bsVariant} className="my-2">
      <Stack direction="horizontal" gap={3}>
        <Icon size="2.5em" />
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
