import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Alert, Container, Stack } from "react-bootstrap";
import KaPlanIcon from "./kaplan-svg";

import { API_BASE_URL, BACKEND_INFO_KEY, VERSION } from "../constants";

const Footer = () => {
  const versionFrontend: string = VERSION;

  const info = useQuery({
    queryKey: [BACKEND_INFO_KEY],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/info`);
      if (!response.ok) {
        throw new Error("Got an invalid response from backend.");
      }
      return response.json();
    },
    gcTime: 1000 * 60 * 60 * 24, // 1 day
  });

  return (
    <footer className="fixed-bottom bg-light py-3">
      <Container className="bg-light text-muted">
        {versionFrontend &&
          info.data?.version?.KeinPlanBackend != versionFrontend && (
            <Alert variant="danger" className="mb-3">
              Auf diesem Server läuft eine andere Backend-Version (
              {info.data?.version?.KeinPlanBackend ?? "unbekannt"}), sodass es
              zu Fehlfunktionen kommen kann. Bitte aktualisiere die Software
              bzw. Docker-Images!
            </Alert>
          )}
        <Stack direction="horizontal" gap={3}>
          {info.data?.env?.GithubLink && (
            <div>
              <Link
                href={info.data.env.GithubLink}
                className="text-muted"
                title="KeinPlan auf Github"
                target="_blank"
              >
                <FontAwesomeIcon icon={faGithub} size="xl" />
              </Link>
            </div>
          )}
          <div className="me-auto">
            KeinPlan{" "}
            {versionFrontend ? `v${versionFrontend}` : "(unbekannte Version)"}
          </div>
          {info.data?.env?.KaPlanLink && (
            <div>
              <Link
                href={info.data.env.KaPlanLink}
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
