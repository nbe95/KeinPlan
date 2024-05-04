import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";

import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { b64_encode } from "../../utils/base64";
import {
  API_BASE_URL,
  KAPLAN_ICS_HEADER,
  KAPLAN_QUERY_KEY,
} from "../../utils/constants";
import {
  addDaysToDate,
  getDateString,
  getMonday,
  getWeek,
  getWeekYear,
} from "../../utils/dates";
import { TimeSheetData, TimeSheetDate } from "./common";

type FormTimeSheetDataProps = {
  timeSheetData: TimeSheetData;
  setTimeSheetData: (data: TimeSheetData) => void;
  prevStep: () => void;
};

export const FormTimeSheetData = (props: FormTimeSheetDataProps) => {
  const fiveDaysAgo = addDaysToDate(new Date(), -5);
  const [targetDate, setTargetDate] = useState(getMonday(fiveDaysAgo));
  const getCalWeekLabel = useCallback(
    (): string => `KW ${getWeek(targetDate)}/${getWeekYear(targetDate)}`,
    [targetDate],
  );

  const prevWeek = () => {
    setTargetDate(addDaysToDate(getMonday(targetDate), -7));
  };
  const nextWeek = () => {
    setTargetDate(addDaysToDate(getMonday(targetDate), 7));
  };

  // Sync targetDate with props.targetDate
  useEffect(() => {
    props.setTimeSheetData({ targetDate, ...props.timeSheetData });
  }, [targetDate]);

  const getKaplanEncodedString = useCallback(
    (): string => b64_encode(props.timeSheetData?.kaPlanIcs ?? ""),
    [props.timeSheetData?.kaPlanIcs],
  );

  const getEndpointUrl = useCallback((): URL => {
    const startDate = getMonday(props.timeSheetData.targetDate);
    const endDate = addDaysToDate(startDate, 6);

    const url = new URL(`${API_BASE_URL}/kaplan`);
    url.searchParams.append("from", getDateString(startDate));
    url.searchParams.append("to", getDateString(endDate));
    return url;
  }, [props.timeSheetData]);

  const { data, refetch, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: [KAPLAN_QUERY_KEY],
    queryFn: async () => {
      const response: Response = await fetch(getEndpointUrl(), {
        method: "GET",
        headers: {
          [KAPLAN_ICS_HEADER]: getKaplanEncodedString(),
        },
      });
      if (!response.ok) {
        let msg: string = `The KaPlan query returned status code ${response.status} (${response.statusText}).`;
        try {
          msg = await response.json().then((payload) => payload.message);
        } finally {
          throw Error(msg);
        }
      }
      return response.json();
    },
    select: (data: any): TimeSheetDate[] => data.dates,
    enabled: false, // Trigger query only using refetch() manually
  });
  return (
    <>
      <h3 className="mb-4 mt-5">Schritt 2: Termine aus KaPlan laden</h3>
      <Row>
        <Col lg={6} md={12}>
          <Form.Group className="mb-4">
            <Form.Label>
              Für welche Kalenderwoche möchtest du eine Stundenliste erstellen?
            </Form.Label>
            <InputGroup className="px-auto">
              <Form.Control
                type="date"
                name="target_date"
                placeholder="Datum"
                value={getDateString(targetDate)}
                onChange={(event) => {
                  const date = (event.target as HTMLInputElement).valueAsDate;
                  if (date) {
                    setTargetDate(date);
                  }
                }}
                required
              />
              <InputGroup.Text>
                <Button variant="none" className="py-0" onClick={prevWeek}>
                  <FontAwesomeIcon icon={faCircleChevronLeft} />
                </Button>
                {getCalWeekLabel()}
                <Button variant="none" className="py-0" onClick={nextWeek}>
                  <FontAwesomeIcon icon={faCircleChevronRight} />
                </Button>
              </InputGroup.Text>
            </InputGroup>
            <Form.Text>
              Wähle irgendein Datum aus, das in der gewünschten Kalenderwoche
              liegt.
            </Form.Text>
          </Form.Group>
        </Col>
        <Col lg={6} md={12}>
          <Form.Group className="mb-4">
            <Form.Label>Persönlicher KaPlan-Abonnement-String</Form.Label>
            <Form.Control
              type="text"
              name="kaplan_ics"
              placeholder="KaPlan ICS-Link"
              defaultValue={props.timeSheetData.kaPlanIcs}
              required
            />
            <Form.Text>
              Bitte lies unbedingt, wie dein persönlicher KaPlan-Link
              verarbeitet wird.
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      {/* <Row>
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
      </Row> */}
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

export default FormTimeSheetData;
