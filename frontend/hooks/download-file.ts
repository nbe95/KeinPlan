// Inspired by https://levelup.gitconnected.com/react-custom-hook-typescript-to-download-a-file-through-api-b766046db18a

import { useRef, useState } from "react";

interface DownloadFileProps {
  readonly apiCall: () => Promise<Response>;
  readonly downloadName: string;
  readonly onStart?: () => void;
  readonly onDone?: () => void;
  readonly onError: (e: Error) => void | undefined;
}

export interface DownloadedFileInfo {
  readonly download: () => Promise<void>;
  readonly url: string | undefined;
  readonly name: string | undefined;
  readonly ref: React.MutableRefObject<HTMLAnchorElement | null>;
  readonly isLoading: boolean;
}

// ToDo(Niklas): Use axios

// ToDo(Niklas): Make API request only once upon page load and download on click
export const useDownloadFile = (props: DownloadFileProps): DownloadedFileInfo => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [url, setFileUrl] = useState<string>();
  const [name, setFileName] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const download = async () => {
    try {
      setIsLoading(true);
      if (props.onStart) props.onStart();

      const data = await props.apiCall();
      const url = URL.createObjectURL(new Blob([await data.blob()]));
      setFileUrl(url);
      setFileName(props.downloadName);

      // Simulate click on hidden anchor tag identified by ref attribute
      ref.current?.click();

      setIsLoading(false);
      if (props.onDone) props.onDone();
    } catch (error) {
      props.onError(error);
    }
  };

  return { download, url, name, ref, isLoading };
};
