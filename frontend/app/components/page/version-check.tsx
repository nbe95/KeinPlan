"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";
import { API_ENDPOINT_VERSION, BACKEND_VERSION_KEY, VERSION_FRONTEND } from "../../utils/constants";
import { ClientError, isClientError, retryUnlessClientError } from "../../utils/network";
import MsgBox from "../msg-box";
import Container from "./container";

const VersionCheck = () => {
  const { data, isSuccess } = useQuery({
    queryKey: [BACKEND_VERSION_KEY],
    queryFn: async () => {
      return axios
        .get(API_ENDPOINT_VERSION)
        .then((response) => response.data)
        .catch((error) => {
          const msg: string =
            error.response?.data?.message ??
            error.response?.data ??
            `The backend query returned status code ${error.response?.status}.`;
          if (isClientError(error.response?.status)) {
            throw new ClientError(msg);
          }
          throw Error(msg);
        });
    },
    retry: (count, error) => retryUnlessClientError(error, count, 5),
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const versionBackend: string | undefined = useMemo(
    () => (isSuccess ? data?.KeinPlan?.backend?.version : undefined),
    [data, isSuccess],
  );

  return (
    VERSION_FRONTEND &&
    versionBackend &&
    versionBackend != VERSION_FRONTEND && (
      <Container>
        <MsgBox type="error">
          <p className="my-0">
            Auf diesem Server läuft das Backend mit Version <strong>v{versionBackend}</strong>.
          </p>
          <p className="my-0">
            Aktualisiere die Software bzw. Docker-Images, um Fehlfunktionen zu vermeiden!
          </p>
        </MsgBox>
      </Container>
    )
  );
};

export default VersionCheck;
