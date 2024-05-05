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
} from "../../utils/dates";
import DateCard from "../date-card";
import LoadingSpinner from "../loading";
import MsgBox from "../msg-box";
import { TimeSheetData, TimeSheetDate } from "./common";

type FormDatesProps = {
  timeSheetData: TimeSheetData;
  setTimeSheetData: (data: TimeSheetData) => void;
  dateList: TimeSheetDate[];
  setDateList: (data: TimeSheetDate[]) => void;
  prevStep: () => void;
  nextStep: () => void;
};

export const FormDates = (props: FormDatesProps) => {
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

  const getKaplanEncodedString = useCallback(
    (): string => b64_encode(props.timeSheetData?.kaPlanIcs ?? ""),
    [props.timeSheetData?.kaPlanIcs],
  );

  const getEndpointUrl = useCallback((): URL => {
    const startDate = getMonday(props.timeSheetData?.targetDate);
    const endDate = addDaysToDate(startDate, 6);

    const url = new URL(API_ENDPOINT_KAPLAN, window.location.href);
    url.searchParams.append("from", getDateString(startDate));
    url.searchParams.append("to", getDateString(endDate));
    return url;
  }, [props.timeSheetData?.targetDate]);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    props.setTimeSheetData({
      type: "weekly",
      format: "pdf",
      targetDate: targetDate,
      kaPlanIcs: event.target.kaplan_ics.value,
    });
  };

  // Trigger backend request as soon as time sheet data has been stored
  useEffect(() => {
    if (props.timeSheetData) {
      refetch();
    }
  }, [props.timeSheetData, refetch]);

  // Save local date list upon successful backend request
  const setDateListRef = props.setDateList;
  useEffect(() => {
    if (isSuccess) {
      setDateListRef(data);
    }
  }, [isFetching, isSuccess, data, setDateListRef]);

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
                  required
                />
                <Button
                  variant="primary"
                  type="submit"
                  className="float-end"
                  disabled={isFetching}
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

        {props.dateList && !isError && !isFetching && (
          <>
            Folgende Daten kamen zurück:
            <Row className="my-4">
              {props.dateList.map((entry: TimeSheetDate, index: number) => (
                <Col key={index} md={12} lg={6} xl={4}>
                  <DateCard date={entry} />
                </Col>
              ))}
            </Row>
          </>
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
              type="button"
              className="float-end"
              disabled={!props.dateList || isError || isFetching}
              onClick={props.nextStep}
            >
              Stundenliste erstellen
            </Button>
          </Col>
        </Row>
      </form>
    </>
  );
};

export default FormDates;
