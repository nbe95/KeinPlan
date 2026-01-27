import { filesize } from "filesize";
import { PropsWithChildren, useRef } from "react";
import { Button, Stack } from "react-bootstrap";
import { IconType } from "react-icons";

type DownloadButtonProps = {
  id?: string;
  fileName: string;
  url: string;
  text: string;
  size: number;
  faIcon: IconType;
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
      <Stack direction="vertical" className="mx-3 d-flex align-items-center justify-content-center">
        <props.faIcon size="4em" className="m-2" />
        <span className="fw-bold">{props.text}</span>
        {props.size && <span className="small">{filesize(props.size, { locale: "de" })}</span>}
      </Stack>
      <a href={props.url} download={props.fileName} ref={ref} className="hidden" tabIndex={-1} />
    </Button>
  );
};

export default DownloadButton;
