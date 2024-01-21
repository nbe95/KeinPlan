import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Container, Stack } from "react-bootstrap";

// import KaPlanIcon from "../public/kaplan-icon.svg"
import KaPlanIcon from "./kaplan-svg";

export const Footer = () => {
  const version: string | undefined = process.env.NEXT_PUBLIC_KEINPLAN_VERSION;
  const kaPlanLink: string | undefined =
    process.env.NEXT_PUBLIC_KAPLAN_HYPERLINK;

  return (
    <footer className="fixed-bottom bg-light py-3">
      <Container className="bg-light text-muted">
        <Stack direction="horizontal" gap={3}>
          <div className="me-auto">
            KeinPlan {version ? `v${version}` : "(unbekannte Version)"}
          </div>
          <div>
            <Link href="https://github.com/nbe95/KeinPlan" target="_blank">
              <FontAwesomeIcon icon={faGithub} size="xl" />
            </Link>
          </div>
          {kaPlanLink && (
            <div>
              <Link href={kaPlanLink} target="_blank">
                <KaPlanIcon width={24} height={24} />
              </Link>
            </div>
          )}
        </Stack>
      </Container>
    </footer>
  );
};
