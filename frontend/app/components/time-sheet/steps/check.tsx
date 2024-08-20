import { useRouter } from "next/navigation";
import { Col, Row } from "react-bootstrap";
import MsgBox from "../../msg-box";
import { NextButton, PrevButton } from "../../process-button";
import DateCard from "../date-card";
import { DateEntry } from "../generator";

type CheckProps = {
  dateList: DateEntry[];
  prevStep: () => void;
  nextStep: () => void;
};

const CheckStep = (props: CheckProps) => {
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    props.nextStep();
    router.push("#time-sheet");
  };

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <p className="lead">Fast fertig! Überprüfe bitte kurz deine Termine.</p>
      <p>
        Wenn alles so stimmt, klicke auf <q>Weiter</q>.
      </p>
      <Row className="my-4">
        {props.dateList.length ? (
          props.dateList.map((entry: DateEntry, index: number) => (
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
        <Col className="d-flex justify-content-end order-2">
          <NextButton submit />
        </Col>
        <Col className="d-flex justify-content-start order-1">
          <PrevButton callback={props.prevStep} />
        </Col>
      </Row>
    </form>
  );
};

export default CheckStep;
