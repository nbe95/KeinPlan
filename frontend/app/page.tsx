"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import Container from "./components/layout/container";
import { CondLink } from "./components/link";
import MsgBox from "./components/msg-box";
import TimeSheetGenerator from "./components/time-sheet/generator";
import {
  ADMIN_MAIL,
  API_ENDPOINT_VERSION,
  BACKEND_VERSION_KEY,
  GITHUB_LINK,
  PROD,
  VERSION_FRONTEND,
} from "./utils/constants";
import { createMailToLink } from "./utils/mail";
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
        <hr className="col-3 col-md-2" />
        <Row gap={5}>
          <Col md={6}>
            <div className="mt-5">
              <h2>Haftungsausschluss</h2>
              <p>
                <q>KeinPlan</q> ist ein rein privates Projekt und steht in keinerlei Verbindung mit{" "}
                <em>KaPlan</em> oder einer spezifischen Pfarrgemeinde.
              </p>
              <p>
                Jegliche Nutzung, insbesondere bzgl. des Inhalts erstellter Stunden&shy;listen,
                erfolgt rein auf eigene Verantwortung des Anwenders und <b>ohne jegliche Gewähr</b>.
              </p>
              <p>
                Bitte beachte, dass auf dieser Webseite nur spezielle <em>KaPlan</em>-Arbeitsgruppen
                und/oder -Server vom Administrator freigeschaltet sein könnten.
              </p>
            </div>

            <div className="mt-5">
              <h2>Fragen oder Unklarheiten?</h2>
              <p>
                Kommt vor. Melde dich beim{" "}
                <CondLink
                  condition={!!ADMIN_MAIL}
                  href={createMailToLink({ recipient: ADMIN_MAIL })}
                >
                  Admin deines Vertrauens
                </CondLink>
                .
              </p>
              <p>
                Solltest du einen Fehler finden, melde bitte auch dies oder{" "}
                <CondLink condition={!!GITHUB_LINK} href={`${GITHUB_LINK}/issues`}>
                  erstelle ein Ticket
                </CondLink>{" "}
                auf GitHub.
              </p>
            </div>
          </Col>

          <Col md={6}>
            <div className="mt-5">
              <h2>Datenschutz</h2>
              <p>
                Dieses Tool verarbeitet im Zuge der Erstellung personali&shy;sierter
                Stunden&shy;listen personen&shy;bezogene Daten. Der Code ist{" "}
                <CondLink condition={!!GITHUB_LINK} href={GITHUB_LINK}>
                  komplett quelloffen
                </CondLink>{" "}
                und per Design darauf ausgelegt, solche Daten{" "}
                <b>zu keinem Zeitpunkt dauerhaft zu speichern</b>. Jegliche Eingaben werden nur ein
                einziges Mal pro Anfrage verarbeitet, um <em>KaPlan</em>-Termine abzufragen sowie
                Stundenlisten daraus zu generieren.
              </p>
              <p>
                Um unnötig wiederholte Server-Anfragen zu vermeiden, gibt es einen
                Caching-Mechanismus, bei dem jeder Abonnement-String kurzzeitig verschlüsselt im
                Backend vorgehalten wird. Die Daten&shy;integrität bleibt dabei gewähr&shy;leistet:
                Selbst aus Server Logs oder einem Speicher&shy;abbild können zu keinem Zeitpunkt
                sensible Daten rekon&shy;struiert werden.
              </p>
              <p>
                Für eine einfachere Nutzbarkeit können im 2. Schritt die Werte aller
                Eingabe&shy;felder lokal als Cookie gespeichert werden. Diese Daten verlassen die
                aktuelle Browser-Sitzung nicht und werden zu keinem anderen Zweck weiterverarbeitet.
              </p>
            </div>
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
