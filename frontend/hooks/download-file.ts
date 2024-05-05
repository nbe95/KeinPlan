// Borrowed from  https://levelup.gitconnected.com/react-custom-hook-typescript-to-download-a-file-through-api-b766046db18a

import { useRef, useState } from "react";

interface DownloadFileProps {
  readonly apiDefinition: () => Promise<Response>;
  readonly preDownloading: () => void;
  readonly postDownloading: () => void;
  readonly onError: (e: Error) => void;
  readonly getFileName: () => string;
}

interface DownloadedFileInfo {
  readonly download: () => Promise<void>;
  readonly ref: React.MutableRefObject<HTMLAnchorElement | null>;
  readonly name: string | undefined;
  readonly url: string | undefined;
}

export const useDownloadFile = ({
  apiDefinition,
  preDownloading,
  postDownloading,
  onError,
  getFileName,
}: DownloadFileProps): DownloadedFileInfo => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [url, setFileUrl] = useState<string>();
  const [name, setFileName] = useState<string>();

  const download = async () => {
    try {
      preDownloading();
      const data = await apiDefinition();
      const url = URL.createObjectURL(new Blob([await data.blob()]));
      setFileUrl(url);
      setFileName(getFileName());
      ref.current?.click();
      postDownloading();
      URL.revokeObjectURL(url);
    } catch (error) {
      onError(error);
    }
  };

  return { download, ref, url, name };
};
