"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";
import Container from "./components/layout/container";
import MsgBox from "./components/msg-box";
import TimeSheetGenerator from "./components/time-sheet/generator";
import {
  API_ENDPOINT_VERSION,
  BACKEND_VERSION_KEY,
  PROD,
  VERSION_FRONTEND,
} from "./utils/constants";
import { ClientError, isClientError, retryUnlessClientError } from "./utils/network";

export default function Page() {
  const { data, isError, error } = useQuery({
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

      <Container>
        <hr className="col-3 col-md-2 mb-5" />
        <Row gap={5}>
          <Col md={6}>
            <h2>Mail-Vorlage</h2>
            <p>
              Ready to go beyond the starter template? Check out these open source projects that you
              can quickly duplicate to a new GitHub repository.
            </p>
            <ul className="list-unstyled ps-0">
              <li>
                <Link
                  className="icon-link mb-1"
                  href="https://github.com/twbs/examples/tree/main/icons-font"
                  rel="noopener"
                  target="_blank"
                >
                  Bootstrap npm starter
                </Link>
              </li>
              <li>
                <Link
                  className="icon-link mb-1"
                  href="https://github.com/twbs/examples/tree/main/parcel"
                  rel="noopener"
                  target="_blank"
                >
                  Bootstrap Parcel starter
                </Link>
              </li>
              <li>
                <Link
                  className="icon-link mb-1"
                  href="https://github.com/twbs/examples/tree/main/vite"
                  rel="noopener"
                  target="_blank"
                >
                  Bootstrap Vite starter
                </Link>
              </li>
              <li>
                <Link
                  className="icon-link mb-1"
                  href="https://github.com/twbs/examples/tree/main/webpack"
                  rel="noopener"
                  target="_blank"
                >
                  Bootstrap Webpack starter
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={6}>
            <h2>Datenschutz</h2>
            <p>
              Read more detailed instructions and documentation on using or contributing to
              Bootstrap.
            </p>
            <ul className="list-unstyled ps-0">
              <li>
                <Link className="icon-link mb-1" href="/docs/5.3/getting-started/introduction/">
                  Bootstrap quick start guide
                </Link>
              </li>
              <li>
                <Link className="icon-link mb-1" href="/docs/5.3/getting-started/webpack/">
                  Bootstrap Webpack guide
                </Link>
              </li>
              <li>
                <Link className="icon-link mb-1" href="/docs/5.3/getting-started/parcel/">
                  Bootstrap Parcel guide
                </Link>
              </li>
              <li>
                <Link className="icon-link mb-1" href="/docs/5.3/getting-started/vite/">
                  Bootstrap Vite guide
                </Link>
              </li>
              <li>
                <Link className="icon-link mb-1" href="/docs/5.3/getting-started/contribute/">
                  Contributing to Bootstrap
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

      {!PROD && isError && (
        <Container>
          <MsgBox type="warning" trace={error.message}>
            Es konnten keine Versionsangaben vom Backend abgerufen werden.
            <br />
            <small>(Hinweis: Diese Meldung erscheint nur auf unproduktiven Systemen.)</small>
          </MsgBox>
        </Container>
      )}
      {VERSION_FRONTEND && data?.KeinPlan_backend && data?.KeinPlan_backend != VERSION_FRONTEND && (
        <Container>
          <MsgBox type="error">
            Auf diesem Server läuft das Backend mit Version{" "}
            <strong>v{data.KeinPlan_backend}</strong>. Aktualisiere die Software bzw. Docker-Images,
            um Fehlfunktionen zu vermeiden!
          </MsgBox>
        </Container>
      )}
    </>
  );
}
