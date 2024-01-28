import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import Link from "next/link";
import { Button, Col, Row } from "react-bootstrap";
import { FaqContainer, FaqItem } from "../components/faq";
import PageSection from "../components/page-section";
import PageWrapper from "../components/page-wrapper";

const Page: NextPage = () => {
  const githubLink: string | undefined =
    process.env.NEXT_PUBLIC_KEINPLAN_GITHUB_LINK;

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
              Dieses Online-Tool exportiert vollautomatisch Stundenlisten aus
              deinen in <em>KaPlan</em> hinterlegten Diensten.
            </p>
            <p>
              Mit nur ein paar Klicks erstellt es Auflistungen deiner
              Arbeitszeit, die als PDF herunterladen und anschließend direkt ans
              Pfarrbüro versendet werden können.
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
            Nein. Dieses Tool hat nichts mit <em>KaPlan</em>, der
            Kirchengemeinde usw. zu tun. Daher alles ohne Gewähr.
            <strong>Überprüfe alles, was du ans Pfarrbüro sendest.</strong>
          </FaqItem>
          <FaqItem question="Meine Stundenliste ist fehlerhaft!?">
            Rechne nochmal nach. Wenn du sicher bist, eine Unstimmigkeit
            gefunden zu haben, erstelle gerne{" "}
            <Link href={githubLink + "/issues"} target="_blank">
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
