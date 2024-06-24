import Link from "next/link";
import { Col, Row } from "react-bootstrap";
import Container from "./components/layout/container";
import TimeSheetGenerator from "./components/time-sheet/generator";

export const Page = () => {
  return (
    <>
      <Container>
        <h1 className="text-body-emphasis">Stundenliste in 1 Minute</h1>
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
            <h2 className="text-body-emphasis">Mail-Vorlage</h2>
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
            <h2 className="text-body-emphasis">Datenschutz</h2>
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
    </>
  );
};

export default Page;
