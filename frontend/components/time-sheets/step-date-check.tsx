import { Button, Col, Row } from "react-bootstrap";

import { TimeSheetDate, TimeSheetParams } from "./common";

type TSDateCheckProps = {
  dateList: TimeSheetDate[];
  setDateList: (dateList: TimeSheetDate[]) => void;
};

export const TSDateCheck = (props: TSDateCheckProps) => {
  console.log(props.dateList)
  return (
    <>
      <h2 className="mb-4 mt-5">Schritt 2: Termine kontrollieren</h2>
      <ul>
        {
          props.dateList.map(entry => (<li>{JSON.stringify(entry)}</li>))
        }
      </ul>
      <Row>
        <Col>
          <Button
            variant="secondary"
            type="button"
            className="float-start"
            onClick={() => props.setDateList(null)}
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
