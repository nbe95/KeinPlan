import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Container, Stack } from "react-bootstrap";

import { useContext } from "react";
import { BackendInfoContext } from "../utils/backend-info";
import { PROD, VERSION } from "../utils/constants";
import MsgBox from "./msg-box";

const Footer = () => {
  const versionFrontend: string = VERSION;
  const info: any = useContext(BackendInfoContext);

  return (
    <footer className="bg-light">
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
          <Stack direction="horizontal" gap={3}>
            {info.env?.KaPlanLink && (
              <Link
                href={info.env.KaPlanLink}
                className="text-muted link-underline link-underline-secondary link-underline-opacity-25 link-underline-opacity-75-hover"
                title="KaPlan Web öffnen"
                target="_blank"
              >
                KaPlan Web
              </Link>
            )}
            {info.env?.AdminMail && (
              <Link
                href={`mailto:${info.env.AdminMail}`}
                className="text-muted link-underline link-underline-secondary link-underline-opacity-25 link-underline-opacity-75-hover"
                title="E-Mail an den Administrator"
                target="_blank"
              >
                Kontakt
              </Link>
            )}
          </Stack>
        </Stack>
      </Container>
    </footer>
  );
};

export default Footer;
