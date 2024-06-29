import { Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { NextButton, PrevButton } from "../../process-button";
import DateCard from "../date-card";
import { TimeSheetDate } from "../generator";

type CheckProps = {
  dateList: TimeSheetDate[];
  prevStep: () => void;
  nextStep: () => void;
};

const CheckStep = (props: CheckProps) => {
  return (
    <form>
      <p className="lead">Fast fertig! Überprüfe bitte kurz deine Termine.</p>
      <p>
        Wenn alles so stimmt, klicke auf <q>Weiter</q>.
      </p>
      <Row className="my-4">
        {props.dateList.map((entry: TimeSheetDate, index: number) => (
          <Col key={index} sm={12} md={6}>
            <DateCard date={entry} />
          </Col>
        ))}
      </Row>
      <Row>
        <Col className="mb-4">
          <hr className="col-3 col-md-2 mb-" />
          <Form.Group>
            <Form.Check
              type="switch"
              id="confirm"
              label="Eingaben speichern, damit's beim nächsten Mal noch schneller geht."
              onClick={() => {
                toast.info("Nice.");
              }}
            />
            <Form.Text>
              Speichert deine bisherigen Eingaben als Cookie in deinem Browser. Deine Daten sind
              sicher und bleiben ausschließlich bei dir.
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-start">
          <PrevButton callback={props.prevStep} />
        </Col>
        <Col className="d-flex justify-content-end">
          <NextButton callback={props.nextStep} />
        </Col>
      </Row>
    </form>
  );
};

export default CheckStep;
