import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import Link from "next/link";
import { Button, Col, Row } from "react-bootstrap";
import { FaqContainer, FaqItem } from "../components/faq";
import PageSection from "../components/page-section";
import PageWrapper from "../components/page-wrapper";

const Page: NextPage = () => {
  return (
    <PageWrapper>
      <PageSection headline="Worum geht's?">
        <Row>
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
              hinterlegten Diensten gefüttert werden. Nicht mehr, aber auch
              nicht weniger.
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
        <FaqContainer>
          <FaqItem question="Ist das hier offiziell?">
            Nein. Dieses Tool hat nichts mit KaPlan, der Kirchengemeinde usw. zu
            tun. Daher alles ohne Gewähr.<br /><strong>Überprüfe alles, was du ans Pfarrbüro sendest.</strong>
          </FaqItem>
          <FaqItem question="Eine Stundenliste ist fehlerhaft!?">
            Rechne nochmal nach. Wenn du sicher bist, einen Fehler gefunden zu
            haben, erstelle gerne{" "}
            <Link
              href="https://github.com/nbe95/KeinPlan/issues/new"
              target="_blank"
            >
              ein Ticket
            </Link>{" "}
            mit genauer Beschreibung des Fehlers oder melde dich direkt beim
            KeinPlan-Administrator deines Vertrauens.
          </FaqItem>
          <FaqItem question="Ist das alles den Aufwand wert?">
            Ja. Allein aus Prinzip.
          </FaqItem>
        </FaqContainer>
      </PageSection>
    </PageWrapper>
  );
};

export default Page;
