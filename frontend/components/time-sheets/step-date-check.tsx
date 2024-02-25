import { Button, Col, Row } from "react-bootstrap";

import { TimeSheetDate, TimeSheetParams } from "./common";

type TSDateCheckProps = {
  setParams: (params: TimeSheetParams) => void;
  dateList: TimeSheetDate[];
};

export const TSDateCheck = (props: TSDateCheckProps) => {
  return (
    <>
      <h2 className="mb-4 mt-5">Schritt 2: Termine kontrollieren</h2>
      Hello world!
      <Row>
        <Col>
          <Button
            variant="secondary"
            type="button"
            className="float-start"
            onClick={() => props.setParams(undefined)}
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
