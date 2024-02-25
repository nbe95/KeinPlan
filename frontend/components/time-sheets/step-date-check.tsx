import { Alert, Button, Col, Row } from "react-bootstrap";

import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, KAPLAN_QUERY_KEY } from "../../constants";
import LoadingSpinner from "../loading-spinner";
import { TSParams } from "./common";

type TSDateCheckProps = {
  params: TSParams;
  prevStep: () => void;
  nextStep: () => void;
};

export const TSDateCheck = (props: TSDateCheckProps) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [KAPLAN_QUERY_KEY],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/kaplan/`);
      return response.json();
    },
  });

  return (
    <>
      <h2 className="mb-4">Schritt 2: Termine kontrollieren</h2>

      {isLoading ? (
        <LoadingSpinner message="KaPlan-Daten abholen..." />
      ) : isError ? (
        <Alert variant="danger" className="my-5">
          Fehler bei Anfrage ans Backend: {error.message}
        </Alert>
      ) : (
        "Hello world!"
      )}
      <Row>
        <Col>
          <Button
            variant="secondary"
            type="button"
            className="float-start"
            onClick={props.prevStep}
          >
            Zurück
          </Button>
        </Col>
        <Col>
          <Button
            variant="primary"
            type="submit"
            className="float-end"
            disabled
          >
            Weiter
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default TSDateCheck;
