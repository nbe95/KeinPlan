import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import { Button, Col, Row } from "react-bootstrap";
import PageWrapper from "../components/page-wrapper";
import PageSection from "../components/page-section";
import Link from "next/link";

const Page: NextPage = () => {
  return (
    <PageWrapper>
      <PageSection headline="Worum geht's?">
        <Row gap={5}>
          <Col md={6} lg={4}>
            <blockquote className="blockquote text-center p-3 mx-3 mb-5 m-auto bg-light shadow rounded">
              <p>
                Warum Stundenzettel von Hand ausfüllen, wenn doch alle meine
                Dienste mit Datum und Uhrzeit schon offiziell in <em>KaPlan</em>{" "}
                stehen?
              </p>
              <p>
                – <strong>KeinPlan</strong>!
              </p>
            </blockquote>
          </Col>
          <Col md={6} lg={8}>
            <p className="lead">
              Wenn du dir diese Frage auch schonmal gestellt hast, bist du hier
              genau richtig.
            </p>
            <p>
              Dieses Online-Tool erzeugt{" "}
              <span className="text-decoration-line-through">Datenmüll</span>{" "}
              Stundenlisten, die vollautomatisch 1:1 mit den in <em>KaPlan</em>{" "}
              hinterlegten Diensten gefüttert werden. Nicht mehr, aber auch nicht
              weniger.
            </p>
            <p>
              Das bedeutet, hier kannst du mit nur wenigen Klicks fertige
              Stundenlisten erstellen, als PDF herunterladen und anschließend
              direkt zwecks Prozessbefriedigung ans Pfarrbüro versenden.
            </p>
            <Button variant="primary" className="mx-auto" href="/time-sheet">
              <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
              Stundenliste erstellen
            </Button>
          </Col>
        </Row>
      </PageSection>

      <PageSection headline="FAQ">
        <p className="lead mb-0">Ist das hier offiziell?</p>
        <p>
          Nein. Alles ohne Gewähr. Überprüfe alles, was du ans Pfarrbüro
          sendest.
        </p>

        <p className="lead mb-0">Eine Stundenliste ist fehlerhaft.</p>
        <p>
          Rechne nochmal nach. Wenn du sicher bist, einen Fehler gefunden zu
          haben, erstelle gerne{" "}
          <Link
            href="https://github.com/nbe95/KeinPlan/issues/new"
            target="_blank">
              ein Ticket
          </Link>{" "}
          mit genauer Fehlerbeschreibung oder melde dich direkt beim
          KeinPlan-Administrator deines Vertrauens.
        </p>

        <p className="lead mb-0">Ist das alles den Aufwand wert?</p>
        <p>Ja. Allein aus Prinzip.</p>
      </PageSection>
    </PageWrapper>
  );
};

export default Page;
