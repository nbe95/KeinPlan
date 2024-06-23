import { faCircleChevronLeft, faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import strftime from "strftime";
import { b64_encode } from "../../utils/base64";
import { API_ENDPOINT_KAPLAN, KAPLAN_ICS_HEADER, KAPLAN_QUERY_KEY } from "../../utils/constants";
import { addDaysToDate, getMonday, getWeek, getWeekYear, parseDateStr } from "../../utils/dates";
import { ClientError, isClientError, retryUnlessClientError } from "../../utils/network";
import LoadingSpinner from "../loading";
import MsgBox from "../msg-box";
import { TimeSheetDate, TimeSheetParams } from "./common";
import DateCard from "./date-card";
import { NextButton, PrevButton } from "./process-button";

type FormDatesProps = {
  timeSheetParams: TimeSheetParams;
  setTimeSheetParams: (data: TimeSheetParams) => void;
  dateList: TimeSheetDate[];
  setDateList: (data: TimeSheetDate[]) => void;
  prevStep: () => void;
  nextStep: () => void;
};

const FormDates = (props: FormDatesProps) => {
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
  const getDateStr = (date: Date): string => strftime("%Y-%m-%d", date);

  const { data, refetch, isFetching, isSuccess, isError, error } = useQuery({
    queryKey: [KAPLAN_QUERY_KEY, props.timeSheetParams],
    queryFn: async () => {
      const startDate = getMonday(props.timeSheetParams?.targetDate);
      const endDate = addDaysToDate(startDate, 6);
      return axios
        .get(API_ENDPOINT_KAPLAN, {
          params: {
            from: getDateStr(startDate),
            to: getDateStr(endDate),
          },
          headers: {
            [KAPLAN_ICS_HEADER]: b64_encode(props.timeSheetParams?.kaPlanIcs),
          },
        })
        .then((response) => response.data)
        .catch((error) => {
          const msg: string =
            error.response?.data ??
            `The backend query returned status code ${error.response?.status}.`;
          if (isClientError(error.response?.status)) {
            throw new ClientError(msg);
          }
          throw Error(msg);
        });
    },
    retry: (count, error) => retryUnlessClientError(error, count, 5),
    select: (data: any): TimeSheetDate[] =>
      data.dates?.map((date: any): TimeSheetDate => {
        return {
          title: date.title ?? "",
          role: date.role ?? "",
          location: date.location_short ?? "",
          time: {
            begin: parseDateStr(date.begin),
            end: parseDateStr(date.end),
          },
        };
      }),
    refetchOnWindowFocus: false,
    enabled: false, // Trigger query only manually using refetch()
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    props.setTimeSheetParams({
      type: "weekly",
      format: "pdf",
      targetDate: targetDate,
      kaPlanIcs: event.target.kaplan_ics.value,
    });
  };

  // Trigger backend request as soon as time sheet data has been stored
  useEffect(() => {
    if (props.timeSheetParams) {
      refetch();
    }
  }, [props.timeSheetParams, refetch]);

  // Save local date list upon successful backend request
  const setDateListRef = props.setDateList;
  useEffect(() => {
    if (isSuccess) {
      setDateListRef(data);
    }
  }, [isFetching, isSuccess, data, setDateListRef]);

  return (
    <form name="time_sheet_data_form" onSubmit={(event) => handleSubmit(event)}>
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
                value={getDateStr(targetDate)}
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
                  <FontAwesomeIcon icon={faCircleChevronLeft} size="lg" />
                </Button>
                {getCalWeekLabel()}
                <Button variant="none" className="py-0" onClick={nextWeek}>
                  <FontAwesomeIcon icon={faCircleChevronRight} size="lg" />
                </Button>
              </InputGroup.Text>
            </InputGroup>
            <Form.Text>
              Wähle irgendein Datum aus, das in der gewünschten Kalenderwoche liegt.
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
                defaultValue={props.timeSheetParams?.kaPlanIcs}
                required
              />
              <Button variant="primary" type="submit" className="float-end" disabled={isFetching}>
                Termine laden
              </Button>
            </InputGroup>
            <Form.Text>
              Bitte lies unbedingt, wie dein persönlicher KaPlan-Link verarbeitet wird.
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <hr />

      {!isError &&
        !isFetching &&
        (props.dateList ? (
          <>
            Folgende Daten kamen zurück:
            <Row className="my-4">
              {props.dateList.map((entry: TimeSheetDate, index: number) => (
                <Col key={index} sm={12} md={8} lg={6} xl={4}>
                  <DateCard date={entry} />
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <p>Bitte erst oben die Felder ausfüllen.</p>
        ))}

      {isFetching && (
        <Row className="py-4">
          <LoadingSpinner message="KaPlan-Server wird kontaktiert…" />
        </Row>
      )}
      {isError && (
        <Row className="py-3">
          <MsgBox type="error" trace={error.message}>
            Fehler bei Anfrage ans Backend. 🤨
            <br />
            Stimmt dein KaPlan-Abonnement-String?
          </MsgBox>
        </Row>
      )}

      <Row>
        <Col className="d-flex justify-content-start">
          <PrevButton callback={props.prevStep} />
        </Col>
        <Col className="d-flex justify-content-end">
          <NextButton
            disabled={!props.dateList || isError || isFetching}
            callback={props.nextStep}
          />
        </Col>
      </Row>
    </form>
  );
};

export default FormDates;