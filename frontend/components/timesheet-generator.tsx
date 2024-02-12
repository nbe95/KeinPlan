import { useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";

const TimesheetGenerator = () => {
  enum Steps {
    Data,
    Check,
    Download,
  }

  const [step, setStep] = useState<Steps>(Steps.Data);

  return (
    <>
      {step == Steps.Data && (
        <>
          <h2>Allgemeine Daten</h2>
          Welche Art von Stundenliste darf's sein?
          <FloatingLabel
            controlId="typeLabel"
            label="Stundenlisten-Typ auswählen"
          >
            <Form.Select aria-label="Floating label select example">
              <option value="weekly" selected>
                Wöchentlich
              </option>
            </Form.Select>
          </FloatingLabel>
          Und für welchen Zeitraum?
          <FloatingLabel controlId="dateLabel" label="Datum auswählen">
            <Form.Control
              type="date"
              placeholder="Datum"
              onChange={(e) => {}}
              required
            />
          </FloatingLabel>
          <FloatingLabel controlId="kaPlanKeyLabel" label="KaPlan ICS URL">
            <Form.Control type="text" required />
          </FloatingLabel>
        </>
      )}
      {step == Steps.Check && <></>}
      {step == Steps.Download && <></>}
    </>
  );
};

export default TimesheetGenerator;
