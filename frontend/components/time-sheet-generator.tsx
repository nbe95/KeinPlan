import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { API_BASE_URL } from "../constants";

type GeneralData = {
  firstName: string;
  lastName: string;
  employer: string;
  targetDate: Date;
  kaPlanIcs: string;
};

const TimeSheetGenerator = () => {
  enum Steps {
    Data,
    Check,
    Download,
  }

  const [generalData, setGeneralData] = useState<GeneralData>();
  const [step, setStep] = useState<Steps>(Steps.Data);

  const kaPlanQuery = useQuery({
    queryKey: ["kaPlan"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/kaplan/`);
      if (!response.ok) {
        return "error";
      }
      return await response.json();
    },
    enabled: step == Steps.Check,
  });

  const handleSubmit = (event) => {
    switch (step) {
      case Steps.Data:
        setGeneralData({
          firstName: event.target.first_name.value,
          lastName: event.target.last_name.value,
          employer: event.target.employer.value,
          targetDate: event.target.target_date.value,
          kaPlanIcs: event.target.kaplan_ics.value,
        });
        setStep(Steps.Check);
        break;

      default:
        break;
    }

    event.preventDefault();
  };

  return (
    <>
      {step == Steps.Data && (
        <>
          <h2 className="mb-4">Schritt 1: Allgemeine Daten</h2>
          <Form
            onSubmit={(event) => {
              handleSubmit(event);
            }}
          >
            <Row>
              <Col lg={6} md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Wer bist du?</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name="first_name"
                      placeholder="Vorname"
                      required
                    />
                    <Form.Control
                      type="text"
                      name="last_name"
                      placeholder="Nachname"
                      required
                    />
                  </InputGroup>
                  <Form.Text>
                    Dein Name, der auf der Stundenliste auftauchen soll.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Für welche Gemeinde arbeitest du?</Form.Label>
                  <Form.Control
                    type="text"
                    name="employee"
                    placeholder="Dienstgeber"
                    required
                  />
                  <Form.Text>
                    Deine Gemeinde, die als Dienstgeber auf der Stundenliste
                    auftauchen soll.
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col lg={6} md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Für welche Kalenderwoche möchtest du eine Stundenliste
                    erstellen?
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="target_date"
                    placeholder="Datum"
                    required
                  />
                  <Form.Text>
                    Wähle irgendein Datum aus, das in der gewünschten
                    Kalenderwoche liegt.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Persönlicher KaPlan-Link</Form.Label>
                  <Form.Control
                    type="password"
                    name="kaplan_ics"
                    placeholder="KaPlan ICS-Link"
                    required
                  />
                  <Form.Text>
                    Bitte lies unbedingt, wie dein persönlicher KaPlan-Link
                    verarbeitet wird.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button variant="primary" type="submit" className="float-end">
                  Weiter
                </Button>
              </Col>
            </Row>
          </Form>
        </>
      )}
      {step == Steps.Check && <></>}
      {step == Steps.Download && <></>}
    </>
  );
};

export default TimeSheetGenerator;
