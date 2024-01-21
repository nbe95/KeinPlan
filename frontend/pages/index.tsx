import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import { Button, Col, Row } from "react-bootstrap";
import PageWrapper from "../components/page-wrapper";

const Page: NextPage = () => {
  return (
    <PageWrapper headline="Worum geht's?">
      {/* <Row xs={1} md={2}> */}
      <Row>
        <Col className="px-0" md={6} lg={4}>
          <blockquote className="blockquote text-center p-3 mx-3 mb-5 m-auto bg-light shadow rounded">
            <p>
              Warum Stundenzettel von Hand ausfüllen, wenn doch alle meine
              Dienste mit Datum und Uhrzeit schon offiziell in{" "}
              <em>KaPlan</em> stehen?
            </p>
            <p>
              – <strong>KeinPlan</strong>!
            </p>
          </blockquote>
        </Col>
        <Col className="px-5" md={6} lg={8}>
          <p className="lead">
            Wenn du dir diese Frage auch schonmal gestellt hast, bist du hier
            genau richtig.
          </p>
          <p>
            Dieses Online-Tool erzeugt{" "}
            <span className="text-decoration-line-through">Datenmüll</span>{" "}
            Stundenlisten, die vollautomatisch 1:1 mit den in{" "}
            <em>KaPlan</em> hinterlegten Diensten gefüttert werden. Nicht
            mehr, aber auch nicht weniger.
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
    </PageWrapper>
  );
};

export default Page;
