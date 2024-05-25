import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren, useRef } from "react";
import { Button, Stack } from "react-bootstrap";

type DownloadButtonProps = {
  fileName: string;
  url: string;
  text: string;
  faIcon: IconDefinition;
  isPrimary: boolean;
};

const DownloadButton = (props: PropsWithChildren<DownloadButtonProps>) => {
  const ref = useRef<HTMLAnchorElement | null>(null);

  return (
    <Button
      variant={props.isPrimary ? "success" : "secondary"}
      className="m-2"
      onClick={() => {
        ref.current?.click();
      }}
    >
      <Stack direction="vertical" gap={1}>
        <FontAwesomeIcon icon={props.faIcon} size="4x" className="m-3" />
        <span>{props.text}</span>
      </Stack>
      <a href={props.url} download={props.fileName} ref={ref} className="hidden" />
    </Button>
  );
};

export default DownloadButton;
