import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { filesize } from "filesize";
import { PropsWithChildren, useRef } from "react";
import { Button, Stack } from "react-bootstrap";

type DownloadButtonProps = {
  id?: string;
  fileName: string;
  url: string;
  text: string;
  size: number;
  faIcon: IconDefinition;
  isPrimary: boolean;
};

const DownloadButton = (props: PropsWithChildren<DownloadButtonProps>) => {
  const ref = useRef<HTMLAnchorElement | null>(null);

  return (
    <Button
      id={props.id}
      variant={props.isPrimary ? "success" : "secondary"}
      className="bg-gradient m-2"
      onClick={() => {
        ref.current?.click();
      }}
    >
      <Stack direction="vertical" className="mx-3">
        <FontAwesomeIcon icon={props.faIcon} size="4x" className="m-2" />
        <span className="fw-bold">{props.text}</span>
        {props.size && <span className="small">{filesize(props.size, { locale: "de" })}</span>}
      </Stack>
      <a href={props.url} download={props.fileName} ref={ref} className="hidden" tabIndex={-1} />
    </Button>
  );
};

export default DownloadButton;
