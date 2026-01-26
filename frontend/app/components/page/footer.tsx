import Link from "next/link";
import { Col, Row, Stack } from "react-bootstrap";
import { FaArrowUpRightFromSquare, FaEnvelope, FaGithub } from "react-icons/fa6";
import Obfuscate from "react-obfuscate";
import {
  ADMIN_MAIL,
  GITHUB_LINK,
  KAPLAN_LINK,
  KAPLAN_WEB_LINK_TARGET,
  VERSION_FRONTEND,
  VERSION_SHA_FRONTEND,
} from "../../utils/constants";
import Container from "./container";
import VersionCheck from "./version-check";

const Footer = () => {
  return (
    <>
      <VersionCheck />
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
                  <Obfuscate
                    email={ADMIN_MAIL}
                    obfuscateChildren={false}
                    style={{ textDecoration: "none" }}
                  >
                    <span className="text-decoration-none" title="E-Mail an den Administrator">
                      <FaEnvelope size="1.5em" className="me-2" />
                      Kontakt
                    </span>
                  </Obfuscate>
                )}
                {KAPLAN_LINK && (
                  <Link
                    href={KAPLAN_LINK}
                    className="text-decoration-none"
                    title="KaPlan Web öffnen"
                    target={KAPLAN_WEB_LINK_TARGET}
                  >
                    <FaArrowUpRightFromSquare size="1.5em" className="me-2" />
                    KaPlan&nbsp;Web
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
                  <FaGithub size="1.5em" />
                </Link>
              )}
              <span
                id="version"
                className="text-center"
                title={VERSION_SHA_FRONTEND ? `Commit ${VERSION_SHA_FRONTEND}` : ""}
              >
                KeinPlan {VERSION_FRONTEND ? `v${VERSION_FRONTEND}` : "(unbekannte Version)"}
              </span>
            </Col>
          </Row>
        </footer>
      </Container>
    </>
  );
};

export default Footer;
