import { Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import MsgBox from "../../msg-box";
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
        {props.dateList.length ? (
          props.dateList.map((entry: TimeSheetDate, index: number) => (
            <Col key={index} sm={12} md={6}>
              <DateCard date={entry} />
            </Col>
          ))
        ) : (
          <MsgBox type="info">
            <p className="mb-0">Nanu &ndash; hier sind ja gar keine Termine?!</p>
            <p className="mb-0">
              Macht nichts. Du kannst auch pro forma eine leere Stundenliste erstellen.
            </p>
          </MsgBox>
        )}
      </Row>
      <Row>
        <Col className="mb-4">
          <hr className="col-3 col-md-2 mb-" />
          <Form.Group>
            <Form.Check
              type="switch"
              id="confirm"
              label="Eingaben speichern und beim nächsten Mal direkt hier beginnen."
              onClick={() => {
                toast.info("Nice.");
              }}
            />
            <Form.Text>
              Speichert deine Daten als Cookie im Browser, damit du sie nicht nochmal eintippen
              musst. Deine Daten sind sicher und bleiben auf diesem Gerät.
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-end order-2">
          <NextButton callback={props.nextStep} />
        </Col>
        <Col className="d-flex justify-content-start order-1">
          <PrevButton callback={props.prevStep} />
        </Col>
      </Row>
    </form>
  );
};

export default CheckStep;
