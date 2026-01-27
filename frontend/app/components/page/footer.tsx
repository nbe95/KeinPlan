"use client";

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
} from "../../utils/constants";
import { CondLink } from "../link";
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
                    <FaEnvelope size="1em" className="me-1" />
                    Kontakt
                  </Obfuscate>
                )}
                {KAPLAN_LINK && (
                  <Link
                    href={KAPLAN_LINK}
                    className="text-decoration-none"
                    target={KAPLAN_WEB_LINK_TARGET}
                  >
                    <FaArrowUpRightFromSquare size="1em" className="me-1" />
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
              <CondLink
                condition={!!GITHUB_LINK}
                href={GITHUB_LINK!}
                className="text-muted text-decoration-none me-2"
                title="KeinPlan auf GitHub"
              >
                <FaGithub size="1.5em" className="me-1" /> KeinPlan{" "}
                {VERSION_FRONTEND ? `v${VERSION_FRONTEND}` : <small>(unbekannte Version)</small>}
              </CondLink>
            </Col>
          </Row>
        </footer>
      </Container>
    </>
  );
};

export default Footer;
