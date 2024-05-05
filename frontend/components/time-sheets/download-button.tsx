import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren } from "react";
import { Button, Stack } from "react-bootstrap";
import { DownloadedFileInfo } from "../../hooks/download-file";

type DownloadButtonProps = {
  isPrimary: boolean;
  text: string;
  faIcon: IconDefinition;
  download: DownloadedFileInfo;
};

export const DownloadButton = (
  props: PropsWithChildren<DownloadButtonProps>,
) => {
  return (
    <>
      <Button
        variant={props.isPrimary ? "success" : "secondary"}
        className="m-2"
        onClick={props.download.download}
      >
        <Stack direction="vertical" gap={1}>
          <FontAwesomeIcon icon={props.faIcon} size="4x" className="m-3" />
          <span>{props.text}</span>
        </Stack>
      </Button>
      <a
        href={props.download.url}
        download={props.download.name}
        ref={props.download.ref}
        className="hidden"
      />
    </>
  );
};

export default DownloadButton;
