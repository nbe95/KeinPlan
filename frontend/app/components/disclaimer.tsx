import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faCookie, faHardDrive } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";
import { Accordion, Button, Col, Modal, Row } from "react-bootstrap";
import { ADMIN_MAIL, GITHUB_LINK } from "../utils/constants";
import { createMailToLink } from "../utils/mail";
import Container from "./layout/container";
import { CondLink } from "./link";

const Disclaimer = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <Container>
      <hr className="col-3 col-md-2" />
      <Row gap={5}>
        <Col md={6}>
          <div className="mt-5">
            <h2>Fragen? Unklarheiten?</h2>
            <p>
              Kommt vor. Melde dich einfach beim{" "}
              <CondLink
                condition={!!ADMIN_MAIL}
                href={createMailToLink({ recipient: ADMIN_MAIL! })}
              >
                Admin deines Vertrauens
              </CondLink>
              .
            </p>
            <p>
              Solltest du einen Fehler auf dieser Seite oder einer Stunden&shy;liste
              fest&shy;stellen, melde dies bitte oder{" "}
              <CondLink condition={!!GITHUB_LINK} href={`${GITHUB_LINK}/issues`}>
                erstelle ein Ticket
              </CondLink>{" "}
              auf GitHub.
            </p>
          </div>

          <div className="mt-5">
            <h2>Datenschutz</h2>
            <p>
              Dieses Tool{" "}
              <Link href="#" onClick={() => setShowPrivacy(true)}>
                verarbeitet personenbezogene Daten
              </Link>
              . Mit der Erstellung einer Stundenliste stimmst du der Datenverarbeitung zu diesem
              Zweck zu.
            </p>
          </div>
        </Col>

        <Col md={6}>
          <div className="mt-5">
            <h2>Haftungsausschluss</h2>
            <p>
              <q>KeinPlan</q> ist ein rein privates Projekt und steht in keinerlei Verbindung zu{" "}
              KaPlan oder einer bestimmten Pfarrgemeinde.
            </p>
            <p>
              Jegliche Nutzung erfolgt rein auf eigene Verantwortung des Anwenders und ohne jegliche
              Gewähr. Dies gilt insbesondere für den Inhalt und die formale Korrektheit erstellter
              Stunden&shy;listen.
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
          fullscreen="sm-down"
        >
          <Modal.Header closeButton>
            <Modal.Title>Datenverarbeitung</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <em>KeinPlan</em> verarbeitet im Zuge der Erstellung personali&shy;sierter
              Stunden&shy;listen sensible, personen&shy;bezogene Daten. Sowohl diese Daten als auch
              die generierten Stundenlisten werden zu keinem Zeitpunkt dauerhaft gespeichert.
            </p>
            <p>
              Grundsätzlich werden jegliche Eingaben nur ein einziges Mal pro Anfrage verarbeitet,
              sei es um entweder Termindaten vom KaPlan-Server abzufragen oder Stundenlisten daraus
              zu generieren. Diese werden ausschließlich auf Anfrage generiert. Nach erfolgtem
              Download werden sie nicht im Speicher oder Dateisystem des Servers persistiert oder
              archiviert.
            </p>

            <p className="mt-4">Lies hier im Detail nach, was mit deinen Daten passiert:</p>

            <Accordion>
              <Accordion.Item eventKey="server-side-caching">
                <Accordion.Header>
                  <FontAwesomeIcon icon={faHardDrive} className="me-2" /> Serverseitiges Caching
                </Accordion.Header>
                <Accordion.Body>
                  <p>
                    Um unnötig wiederholte Anfragen an den KaPlan Upstream-Server zu vermeiden,
                    implementiert das Backend einen Caching-Mechanismus. Dabei wird jeder
                    Abonnement-String nach gewissen Prüfschritten inkl. der damit rückgemeldeten
                    Termindaten kurzzeitig im Speicher vorgehalten. Das passiert verschlüsselt als
                    sog. <Link href="https://de.wikipedia.org/wiki/Hashfunktion">Hash</Link>, sodass
                    bereits angefragte Datensätze direkt zugeordnet und unnötiger Traffic vermieden
                    werden, aber der jeweils zugrunde&shy;liegende Abonnement-String daraus nicht
                    rekonstruiert werden kann.
                  </p>
                  <p>
                    Die Daten&shy;integrität bleibt somit gewährleistet. Selbst aus Server-Logs oder
                    einem Speicher&shy;abbild können zu keinem Zeitpunkt sensible Daten ausgelesen
                    werden.
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="cookies">
                <Accordion.Header>
                  <FontAwesomeIcon icon={faCookie} className="me-2" />
                  Cookies
                </Accordion.Header>
                <Accordion.Body>
                  <p>
                    Für eine einfachere Nutzbarkeit des Tools bei wiederholter Anwendung können die
                    eingegebenen Werte der Eingabe&shy;felder (Name, Arbeitgeber,
                    KaPlan-Abonnement-String) gespeichert werden. Das passiert als Cookie im
                    Browser.
                  </p>
                  <p>
                    Die Daten verlassen die aktuelle Browser-Sitzung nicht und werden zu keinem
                    anderen Zweck ausgelesen oder anderweitig verarbeitet.
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="open-source">
                <Accordion.Header>
                  <FontAwesomeIcon icon={faGithub} className="me-2" /> Open Source Software
                </Accordion.Header>
                <Accordion.Body>
                  <p>
                    Der gesamte Code von <em>KeinPlan</em> ist quelloffen. Er ist im Zuge
                    größtmöglicher Transparenz jederzeit öffentlich auf GitHub einsehbar.
                  </p>
                  <p>
                    <CondLink condition={!!GITHUB_LINK} href={GITHUB_LINK!}>
                      {GITHUB_LINK}
                    </CondLink>{" "}
                  </p>
                  <p>
                    Jeder mit technischem Interesse/Kenntnissen kann <em>KeinPlan</em> lokal als
                    Dienst oder auf einem Server betreiben, z.&nbsp;B. bequem mittels Docker
                    Container.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowPrivacy(false)}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
    </Container>
  );
};

export default Disclaimer;
