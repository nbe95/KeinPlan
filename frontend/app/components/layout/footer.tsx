import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Stack } from "react-bootstrap";
import { ADMIN_MAIL, GITHUB_LINK, KAPLAN_LINK, VERSION_FRONTEND } from "../../utils/constants";
import Container from "./container";

const Footer = () => {
  return (
    <Container>
      <footer className="pt-3 my-3 text-muted border-top">
        <Stack direction="horizontal" gap={3}>
          <div className="me-auto">
            {GITHUB_LINK && (
              <Link href={GITHUB_LINK} className="text-muted me-2" title="KeinPlan auf Github">
                <FontAwesomeIcon icon={faGithub} size="xl" />
              </Link>
            )}
            KeinPlan {VERSION_FRONTEND ? `v${VERSION_FRONTEND}` : "(unbekannte Version)"}
          </div>
          {ADMIN_MAIL && (
            <Link
              href={`mailto:${ADMIN_MAIL}`}
              className="text-muted link-underline link-underline-secondary link-underline-opacity-25 link-underline-opacity-75-hover"
              title="E-Mail an den Administrator"
            >
              Kontakt
            </Link>
          )}
          {KAPLAN_LINK && (
            <Link
              href={KAPLAN_LINK}
              className="text-muted link-underline link-underline-secondary link-underline-opacity-25 link-underline-opacity-75-hover"
              title="KaPlan Web öffnen"
            >
              KaPlan Web
            </Link>
          )}
        </Stack>
      </footer>
    </Container>
  );
};

export default Footer;
