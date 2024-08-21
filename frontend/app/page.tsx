"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import Container from "./components/layout/container";
import { CondLink } from "./components/link";
import MsgBox from "./components/msg-box";
import TimeSheetGenerator from "./components/time-sheet/generator";
import {
  ADMIN_MAIL,
  API_ENDPOINT_VERSION,
  BACKEND_VERSION_KEY,
  GITHUB_LINK,
  VERSION_FRONTEND,
} from "./utils/constants";
import { createMailToLink } from "./utils/mail";
import { ClientError, isClientError, retryUnlessClientError } from "./utils/network";

export default function Page() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  const { data } = useQuery({
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
                KaPlan oder einer spezifischen Pfarrgemeinde.
              </p>
              <p>
                Jegliche Nutzung, insbesondere bzgl. des Inhalts erstellter Stunden&shy;listen,
                erfolgt rein auf eigene Verantwortung des Anwenders und <b>ohne jegliche Gewähr</b>.
              </p>
              <p>
                Bitte beachte, dass auf dieser Webseite nur spezielle KaPlan-Arbeitsgruppen und/oder
                -Server vom Administrator freigeschaltet sein könnten.
              </p>
            </div>
          </Col>

          <Col md={6}>
            <div className="mt-5">
              <h2>Datenschutz</h2>
              <p>
                Dieses Tool verarbeitet personenbezogene Daten.{" "}
                <Link href="#" onClick={() => setShowPrivacy(true)}>
                  Lies hier
                </Link>
                , was genau das bedeutet. Mit der Erstellung einer Stundenliste stimmst du der
                Verarbeitung deiner Daten zu diesem Zweck zu.
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
          <Modal
            show={showPrivacy}
            onHide={() => {
              setShowPrivacy(false);
            }}
            size="lg"
            scrollable={true}
          >
            <Modal.Header closeButton>
              <Modal.Title>Datenverarbeitung</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-4">
                <h5>Grundlegendes</h5>
                <p>
                  <em>KeinPlan</em> verarbeitet im Zuge der Erstellung personali&shy;sierter
                  Stunden&shy;listen sensible, personen&shy;bezogene Daten. Sowohl diese Daten als
                  auch die generierten Stundenlisten werden{" "}
                  <b>zu keinem Zeitpunkt dauerhaft gespeichert</b>.
                </p>
                <p>
                  Jegliche Eingaben werden nur ein einziges Mal pro Anfrage verarbeitet, um entweder
                  Termindaten vom KaPlan-Server abzufragen oder Stundenlisten daraus zu generieren.
                  Diese werden lediglich bei Bedarf generiert und nach erfolgtem Download nicht im
                  Speicher oder Dateisystem des Servers persistiert.
                </p>
              </div>

              <div className="mb-4">
                <h5>Open source</h5>
                <p>
                  Der gesamte Code von <em>KeinPlan</em> ist quelloffen. Er ist im Zuge
                  größtmöglicher Transparenz, insb. hinsichtlich Datenverarbeitung, jederzeit
                  öffentlich einsehbar und auf GitHub verfügbar.
                  <br />
                  <CondLink condition={!!GITHUB_LINK} href={GITHUB_LINK}>
                    {GITHUB_LINK}
                  </CondLink>{" "}
                </p>
              </div>

              <div className="mb-4">
                <h5>Serverseitiges Caching</h5>
                <p>
                  Um unnötig wiederholte Anfragen an den KaPlan-Server zu vermeiden, gibt es einen
                  Caching-Mechanismus. Dabei wird jeder Abonnement-String nach gewissen
                  Prüfschritten inkl. der damit verbundenen Termindaten <b>für kurze Zeit</b> im
                  Backend vorgehalten. Das passiert verschlüsselt als sog.{" "}
                  <Link href="https://de.wikipedia.org/wiki/Hashfunktion">Hash</Link>, sodass
                  bereits angefragte Datensätze direkt zugeordnet und unnötiger Traffic vermieden
                  werden, aber der jeweils zugrunde&shy;liegende Abonnement-String daraus nicht
                  rekonstruiert werden kann.
                </p>
                <p>
                  Die Daten&shy;integrität bleibt somit gewährleistet, denn selbst aus Server Logs
                  oder einem Speicher&shy;abbild können zu keinem Zeitpunkt sensible Daten
                  ausgelesen werden.
                </p>
              </div>

              <div className="mb-4">
                <h5>Cookies</h5>
                <p>
                  Für eine einfachere Nutzbarkeit des Tools bei der wiederholten Anfertigung von
                  Stundenlisten können die Werte aller Eingabe&shy;felder lokal als Cookie
                  gespeichert werden. Diese Daten verlassen die aktuelle Browser-Sitzung nicht und
                  werden zu keinem anderen Zweck ausgelesen oder anderweitig verarbeitet.
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => setShowPrivacy(false)}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>
        </Row>
      </Container>

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
