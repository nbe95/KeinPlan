import { useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";

import { getWeek, getWeekYear } from "../../utils/iso-week";

type TSDataInputProps = {
  setParams: (GeneralData) => void;
  nextStep: () => void;
};

export const TSDataInput = (props: TSDataInputProps) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    props.setParams({
      firstName: event.target.first_name.value,
      lastName: event.target.last_name.value,
      employer: event.target.employer.value,
      targetDate: event.target.target_date.value,
      kaPlanIcs: event.target.kaplan_ics.value,
    });
    props.nextStep();
  };

  const getLastMonday = () => {
    const target = new Date();
    target.setDate(target.getDate() - ((target.getDay() + 6) % 7));
    return target;
  };
  const getCwLabel = (date: Date) => (
    <>{`KW ${getWeek(targetDate)}/${getWeekYear(targetDate)}`}</>
  );
  const [targetDate, setTargetDate] = useState(getLastMonday());

  return (
    <>
      <h2 className="mb-4">Schritt 1: Allgemeine Daten</h2>
      <form onSubmit={(event) => handleSubmit(event)}>
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
                Dein Name, der als Dienstnehmer auf der Stundenliste steht.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Für welche Gemeinde arbeitest du?</Form.Label>
              <Form.Control
                type="text"
                name="employer"
                placeholder="Dienstgeber"
                required
              />
              <Form.Text>
                Deine Gemeinde, die als Dienstgeber auf der Stundenliste
                auftaucht.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col lg={6} md={12}>
            <Form.Group className="mb-3">
              <Form.Label>
                Für welche Kalenderwoche möchtest du eine Stundenliste
                erstellen?
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type="date"
                  name="target_date"
                  placeholder="Datum"
                  defaultValue={targetDate.toISOString().split("T")[0]}
                  onChange={(event) =>
                    setTargetDate(
                      (event.target as HTMLInputElement).valueAsDate,
                    )
                  }
                  required
                />
                <InputGroup.Text>{getCwLabel(targetDate)}</InputGroup.Text>
              </InputGroup>
              <Form.Text>
                Wähle irgendein Datum aus, das in der gewünschten Kalenderwoche
                liegt.
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
      </form>
    </>
  );
};

export default TSDataInput;
