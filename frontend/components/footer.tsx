import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Container, Stack } from "react-bootstrap";
import KaPlanIcon from "./kaplan-svg";

import { useContext } from "react";
import { BackendInfoContext } from "../utils/backend-info";
import { PROD, VERSION } from "../utils/constants";
import MsgBox from "./msg-box";

const Footer = () => {
  const versionFrontend: string = VERSION;
  const info: any = useContext(BackendInfoContext);

  return (
    <footer className="fixed-bottom bg-light py-3">
      <Container className="bg-light text-muted">
        {PROD && info.error && (
          <MsgBox type="warning" trace={info.error}>
            Backend-Informationen konnten nicht abgerufen werden.
          </MsgBox>
        )}
        {versionFrontend &&
          info.version?.KeinPlanBackend &&
          info.version?.KeinPlanBackend != versionFrontend && (
            <MsgBox type="error">
              Auf diesem Server läuft eine andere Backend-Version ({info.version.KeinPlanBackend}),
              sodass es zu Fehlfunktionen kommen kann.
              <br />
              Bitte aktualisiere die Software bzw. Docker Images!
            </MsgBox>
          )}
        <Stack direction="horizontal" gap={3}>
          {info.env?.GithubLink && (
            <div>
              <Link
                href={info.env.GithubLink}
                className="text-muted"
                title="KeinPlan auf Github"
                target="_blank"
              >
                <FontAwesomeIcon icon={faGithub} size="xl" />
              </Link>
            </div>
          )}
          <div className="me-auto">
            KeinPlan {versionFrontend ? `v${versionFrontend}` : "(unbekannte Version)"}
          </div>
          {info.env?.AdminMail && (
            <div>
              <Link
                href={`mailto:${info.env.AdminMail}`}
                className="text-muted"
                title="Kontakt per E-Mail"
                target="_blank"
              >
                <FontAwesomeIcon icon={faEnvelope} size="lg" />
              </Link>
            </div>
          )}
          {info.env?.KaPlanLink && (
            <div>
              <Link
                href={info.env.KaPlanLink}
                className="text-muted"
                title="KaPlan öffnen"
                target="_blank"
              >
                <KaPlanIcon width={24} height={24} />
              </Link>
            </div>
          )}
        </Stack>
      </Container>
    </footer>
  );
};

export default Footer;
