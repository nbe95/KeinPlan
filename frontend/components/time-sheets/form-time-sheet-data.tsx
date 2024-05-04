import {
  Button,
  Col,
  Form,
  InputGroup,
  Row,
  Stack,
  Table,
} from "react-bootstrap";

import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { b64_encode } from "../../utils/base64";
import {
  API_ENDPOINT_KAPLAN,
  KAPLAN_ICS_HEADER,
  KAPLAN_QUERY_KEY,
} from "../../utils/constants";
import {
  addDaysToDate,
  getDateString,
  getMonday,
  getWeek,
  getWeekYear,
  parseDateStr,
  printTime,
} from "../../utils/dates";
import LoadingSpinner from "../loading";
import MsgBox from "../msg-box";
import { TimeSheetData, TimeSheetDate } from "./common";

type FormTimeSheetDataProps = {
  timeSheetData: TimeSheetData;
  setTimeSheetData: (data: TimeSheetData) => void;
  dateList: TimeSheetDate[];
  setDateList: (data: TimeSheetDate[]) => void;
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

  const [kaplanIcsValid, setKaplanIcsValid] = useState(false);

  const getKaplanEncodedString = useCallback(
    (): string => b64_encode(props.timeSheetData?.kaPlanIcs ?? ""),
    [props.timeSheetData?.kaPlanIcs],
  );

  const getEndpointUrl = useCallback((): URL => {
    const startDate = getMonday(props.timeSheetData?.targetDate);
    const endDate = addDaysToDate(startDate, 6);

    const url = new URL(API_ENDPOINT_KAPLAN);
    url.searchParams.append("from", getDateString(startDate));
    url.searchParams.append("to", getDateString(endDate));
    return url;
  }, [props.timeSheetData]);

  const { data, refetch, isFetching, isSuccess, isError, error } = useQuery({
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
    select: (data: any): TimeSheetDate[] =>
      data.dates?.map((date: any): TimeSheetDate => {
        return {
          title: date.title ?? "",
          role: date.role ?? "",
          location: date.location_short ?? "",
          begin: parseDateStr(date.begin),
          end: parseDateStr(date.end),
          breakBegin: parseDateStr(date.breakBegin),
          breakEnd: parseDateStr(date.breakEnd),
        };
      }),
    enabled: false, // Trigger query only manually using refetch()
  });

  useEffect(() => {
    if (isSuccess) {
      props.setDateList(data);
    }
  }, [isFetching]);

  const handleSubmit = (event) => {
    event.preventDefault();
    props.setTimeSheetData({
      type: "weekly",
      targetDate: targetDate,
      kaPlanIcs: event.target.kaplan_ics.value,
    });
    refetch();
  };

  return (
    <>
      <h3 className="mb-4 mt-5">Schritt 2: Termine aus KaPlan abholen</h3>
      <form
        name="time_sheet_data_form"
        onSubmit={(event) => handleSubmit(event)}
      >
        <Row>
          <Col lg={6} md={12}>
            <Form.Group className="mb-4">
              <Form.Label>
                Für welche Kalenderwoche möchtest du eine Stundenliste
                erstellen?
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
              <InputGroup>
                <Form.Control
                  type="text"
                  name="kaplan_ics"
                  placeholder="KaPlan ICS-Link"
                  defaultValue={props.timeSheetData?.kaPlanIcs}
                  onChange={(event) => {
                    setKaplanIcsValid(
                      (event.target as HTMLInputElement).value.length >= 5,
                    );
                  }}
                  required
                />
                <Button
                  variant="primary"
                  type="submit"
                  className="float-end"
                  disabled={isFetching || !kaplanIcsValid}
                >
                  Termine laden
                </Button>
              </InputGroup>
              <Form.Text>
                Bitte lies unbedingt, wie dein persönlicher KaPlan-Link
                verarbeitet wird.
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        {(isFetching || isError || isSuccess) && <hr />}
        {isFetching && (
          <Row className="py-4">
            <LoadingSpinner message="KaPlan-Server wird kontaktiert…" />
          </Row>
        )}
        {isError && (
          <Row className="py-3">
            <MsgBox type="error" trace={error.message}>
              Fehler bei Anfrage ans Backend.
            </MsgBox>
          </Row>
        )}

        {props.dateList && (
          <Row>
            <Col>
              Folgende Daten kamen zurück:
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nr.</th>
                    <th>Datum, Anlass</th>
                    <th>Zeitraum</th>
                    {/* <th>Bearbeiten</th> */}
                  </tr>
                </thead>
                <tbody>
                  {props.dateList.map((entry: TimeSheetDate, index: number) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        <Stack gap={4} direction="horizontal">
                          <span>{entry.begin.toLocaleDateString()}</span>
                          <span className="fw-bold">{entry.title}</span>
                          <span className="text-muted">
                            <small>{entry.location}</small>
                          </span>
                        </Stack>
                      </td>
                      <td>
                        {printTime(entry.begin)} - {printTime(entry.end)}
                        {/* { (entry.breakBegin && entry.breakEnd) && (
                          <>
                            {printTime(entry.breakBegin)} - {printTime(entry.breakEnd)}
                          </>
                        )} */}
                      </td>
                      {/* <td>
<FontAwesomeIcon icon={faPen} size="xl" />
<FontAwesomeIcon icon={faTrash} size="xl" />
<FontAwesomeIcon icon={faSquarePlus} size="xl" />
</td> */}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        )}

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
      </form>
    </>
  );
};

export default FormTimeSheetData;
