import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Col, Row, Stack } from "react-bootstrap";
import {
  ADMIN_MAIL,
  GITHUB_LINK,
  KAPLAN_LINK,
  KAPLAN_WEB_LINK_TARGET,
  VERSION_FRONTEND,
} from "../../utils/constants";
import { createMailToLink } from "../../utils/mail";
import Container from "./container";

const Footer = () => {
  return (
    <Container>
      <footer className="pt-2 my-3 border-top">
        <Row>
          <Col
            xs={12}
            sm={6}
            className="d-flex order-sm-1 justify-content-center justify-content-sm-end my-1"
          >
            <Stack direction="horizontal" gap={4}>
              {ADMIN_MAIL && (
                <Link
                  href={createMailToLink({ recipient: ADMIN_MAIL })}
                  className="link-underline link-underline-secondary link-underline-opacity-25 link-underline-opacity-75-hover"
                  title="E-Mail an den Administrator"
                >
                  <FontAwesomeIcon icon={faEnvelope} size="xs" className="me-2" />
                  Kontakt
                </Link>
              )}
              {KAPLAN_LINK && (
                <Link
                  href={KAPLAN_LINK}
                  className="link-underline link-underline-secondary link-underline-opacity-25 link-underline-opacity-75-hover"
                  target={KAPLAN_WEB_LINK_TARGET}
                  title="KaPlan Web öffnen"
                >
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" className="me-2" />
                  KaPlan Web
                </Link>
              )}
            </Stack>
          </Col>
          <Col
            xs={12}
            sm={6}
            className="d-flex order-sm-0 justify-content-center justify-content-sm-start my-1"
          >
            {GITHUB_LINK && (
              <Link href={GITHUB_LINK} className="text-muted me-2" title="KeinPlan auf Github">
                <FontAwesomeIcon icon={faGithub} size="xl" />
              </Link>
            )}
            KeinPlan {VERSION_FRONTEND ? `v${VERSION_FRONTEND}` : "(unbekannte Version)"}
          </Col>
        </Row>
      </footer>
    </Container>
  );
};

export default Footer;
