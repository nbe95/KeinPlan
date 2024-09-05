"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";
import Disclaimer from "./components/disclaimer";
import Container from "./components/layout/container";
import MsgBox from "./components/msg-box";
import TimeSheetGenerator from "./components/time-sheet/generator";
import { API_ENDPOINT_VERSION, BACKEND_VERSION_KEY, VERSION_FRONTEND } from "./utils/constants";
import { ClientError, isClientError, retryUnlessClientError } from "./utils/network";

export default function Page() {
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
    <>
      <Container>
        <h1>Stundenliste in 1 Minute</h1>
        <p className="fs-5 col-md-10">
          Erstelle mit nur ein paar Klicks Auflistungen deiner Arbeitszeit auf Basis deiner in{" "}
          <em>KaPlan</em> hinterlegten Termine. Lade sie als PDF herunter und sende sie direkt ans
          Pfarrbüro.
        </p>
        <p className="fs-5 col-md-10">
          Ein Tool für alle, die <q>kein Plan</q> haben, warum sie manuell Stundenzettel pflegen
          müssen, obwohl alle Dienste bereits offiziell und zentral verwaltet werden.
        </p>
      </Container>

      <TimeSheetGenerator />

      <Disclaimer />

      {VERSION_FRONTEND && versionBackend && versionBackend != VERSION_FRONTEND && (
        <Container>
          <MsgBox type="error">
            Auf diesem Server läuft das Backend mit Version <strong>v{versionBackend}</strong>.
            Aktualisiere die Software bzw. Docker-Images, um Fehlfunktionen zu vermeiden!
          </MsgBox>
        </Container>
      )}
    </>
  );
}
