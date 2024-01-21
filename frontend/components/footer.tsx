import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Container, Stack } from "react-bootstrap";

export const Footer = () => {
  const version: string | undefined = process.env.NEXT_PUBLIC_KEINPLAN_VERSION;

  return (
    <footer className="fixed-bottom bg-light py-3">
      <Container className="bg-light text-muted">
        <Stack direction="horizontal" gap={3}>
          <div>
            <Link
              href="https://github.com/nbe95/KeinPlan"
              className="text-muted"
              target="_blank"
            >
              <FontAwesomeIcon icon={faGithub} size="xl" />
            </Link>
          </div>
          <div className="me-auto">
            KeinPlan {version ? `v${version}` : "(unbekannte Version)"}
          </div>
        </Stack>
      </Container>
    </footer>
  );
};
