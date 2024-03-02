import { Button, Col, Row, Table } from "react-bootstrap";

import {
  faPen,
  faSquarePlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TimeSheetDate } from "./common";

type TSDateCheckProps = {
  dateList: TimeSheetDate[];
  setDateList: (dateList: TimeSheetDate[]) => void;
};

export const TSDateCheck = (props: TSDateCheckProps) => {
  return (
    <>
      <h2 className="mb-4 mt-5">Schritt 2: Termine kontrollieren</h2>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <td>#</td>
                <td>Datum</td>
                <td>Anlass</td>
                <td>Ort</td>
                <td>Zeitraum</td>
                <td>Pause</td>
                <td>Bearbeiten</td>
              </tr>
            </thead>
            <tbody>
              {props.dateList.map((entry: TimeSheetDate) => (
                <tr>
                  <td>?</td>
                  <td>?</td>
                  <td>{entry.title}</td>
                  <td>{entry.location}</td>
                  <td>
                    {entry.begin} - {entry.end}
                  </td>
                  <td>?</td>
                  <td>
                    <FontAwesomeIcon icon={faPen} size="xl" />
                    <FontAwesomeIcon icon={faTrash} size="xl" />
                    <FontAwesomeIcon icon={faSquarePlus} size="xl" />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
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
