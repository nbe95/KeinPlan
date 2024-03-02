import { useCallback, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Spinner } from "react-bootstrap";

import { useQuery } from "@tanstack/react-query";
import {
  API_BASE_URL,
  KAPLAN_ICS_HEADER,
  KAPLAN_QUERY_KEY,
} from "../../constants";
import { b64_encode } from "../../utils/base64";
import {
  addDaysToDate,
  getDateString,
  getMonday,
  getWeek,
  getWeekYear,
} from "../../utils/dates";
import MsgBox from "../msg-box";
import { TimeSheetDate, TimeSheetParams } from "./common";

type TSParamInputProps = {
  params?: TimeSheetParams;
  setParams: (params: TimeSheetParams) => void;
  setDateList: (dates: TimeSheetDate[]) => void;
};

export const TSParamInput = (props: TSParamInputProps) => {
  const fiveDaysAgo = addDaysToDate(new Date(), -5);
  const [targetDate, setTargetDate] = useState(getMonday(fiveDaysAgo));

  const getCalWeekLabel = useCallback(
    (): string => `KW ${getWeek(targetDate)}/${getWeekYear(targetDate)}`,
    [targetDate],
  );

  const getEndpointUrl = useCallback((): URL => {
    const startDate = getMonday(props.params.dateInTargetWeek);
    const endDate = addDaysToDate(startDate, 6);

    const url = new URL(`${API_BASE_URL}/kaplan`);
    url.searchParams.append("from", getDateString(startDate));
    url.searchParams.append("to", getDateString(endDate));
    return url;
  }, [props.params]);

  const getKaplanEncodedString = useCallback(
    (): string => b64_encode(props.params?.kaPlanIcs ?? ""),
    [props.params],
  );

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

  const handleSubmit = (event) => {
    event.preventDefault();
    props.setParams({
      firstName: event.target.first_name.value,
      lastName: event.target.last_name.value,
      employer: event.target.employer.value,
      dateInTargetWeek: targetDate,
      kaPlanIcs: event.target.kaplan_ics.value,
    });
  };

  useEffect(() => {
    // Trigger query as soon as params have been set
    if (props.params) {
      refetch();
    }
  }, [props.params]);

  useEffect(() => {
    // Trigger next step as soon as we've got a date list
    if (isSuccess) {
      props.setDateList(data);
    }
  }, [isSuccess]);

  return (
    <>
      <h3 className="mb-4 mt-5">Schritt 1: Allgemeine Daten</h3>

      <form onSubmit={(event) => handleSubmit(event)}>
        <Row>
          <Col lg={6} md={12}>
            <Form.Group className="mb-4">
              <Form.Label>Wer bist du?</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="first_name"
                  placeholder="Vorname"
                  required
                />
                <Form.Control
                  type="text"
                  name="last_name"
                  placeholder="Nachname"
                  required
                />
              </InputGroup>
              <Form.Text>
                Dein Name, der als Dienstnehmer auf der Stundenliste steht.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Für welche Gemeinde arbeitest du?</Form.Label>
              <Form.Control
                type="text"
                name="employer"
                placeholder="Dienstgeber"
                required
              />
              <Form.Text>
                Deine Gemeinde, die als Dienstgeber auf der Stundenliste
                auftaucht.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col lg={6} md={12}>
            <Form.Group className="mb-4">
              <Form.Label>
                Für welche Kalenderwoche möchtest du eine Stundenliste
                erstellen?
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type="date"
                  name="target_date"
                  placeholder="Datum"
                  defaultValue={getDateString(targetDate)}
                  onChange={(event) => {
                    const date = (event.target as HTMLInputElement).valueAsDate;
                    if (date) {
                      setTargetDate(date);
                    }
                  }}
                  required
                />
                <InputGroup.Text>{getCalWeekLabel()}</InputGroup.Text>
              </InputGroup>
              <Form.Text>
                Wähle irgendein Datum aus, das in der gewünschten Kalenderwoche
                liegt.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Persönlicher KaPlan-Link</Form.Label>
              <Form.Control
                type="password"
                name="kaplan_ics"
                placeholder="KaPlan ICS-Link"
                required
              />
              <Form.Text>
                Bitte lies unbedingt, wie dein persönlicher KaPlan-Link
                verarbeitet wird.
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              variant="primary"
              type="submit"
              className="float-end"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  <span>Lädt…</span>
                </>
              ) : (
                <>Weiter</>
              )}
            </Button>
          </Col>
        </Row>
      </form>

      {isError && (
        <div className="my-5">
          <MsgBox type="error" trace={error.message}>
            Fehler bei Anfrage ans Backend.
          </MsgBox>
        </div>
      )}
    </>
  );
};

export default TSParamInput;
