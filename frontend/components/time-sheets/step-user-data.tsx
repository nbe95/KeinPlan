import { useCallback, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Spinner } from "react-bootstrap";

import { useQuery } from "@tanstack/react-query";
import {
  API_BASE_URL,
  KAPLAN_ICS_HEADER,
  KAPLAN_QUERY_KEY,
} from "../../utils/constants";
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
import { useCookies } from "react-cookie";

type TSParamInputProps = {
  params?: TimeSheetParams;
  setParams: (params: TimeSheetParams) => void;
  setDateList: (dates: TimeSheetDate[]) => void;
};

export const TSUserData = (props: TSParamInputProps) => {
  const [cookies, setCookie, removeCookie] = useCookies()
  const [enableCookie, setEnableCookie] = useState<boolean>(!!cookies.userData)
  useEffect(() => {
    if (!enableCookie) {
      removeCookie("userData")
    }
  }, [enableCookie])

  const fiveDaysAgo = addDaysToDate(new Date(), -5);
  const [targetDate, setTargetDate] = useState(getMonday(fiveDaysAgo));
  const getCalWeekLabel = useCallback(
    (): string => `KW ${getWeek(targetDate)}/${getWeekYear(targetDate)}`,
    [targetDate],
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    props.setParams(
      {
        firstName: event.target.first_name.value,
        lastName: event.target.last_name.value,
        employer: event.target.employer.value,
        ...props.params
      });
  };

  useEffect(() =>{
    // Trigger query and cookie as soon as params have been set
    if (props.params) {
      if (enableCookie) {
        setCookie("userData", props.params, { expires: addDaysToDate(new Date(), 365) })
      }
    //   refetch();
    }
  }, [props.params]);

  return (
    <>
      <h3 className="mb-4 mt-5">Schritt 1: Allgemeine Daten</h3>

      <form name="param_form" onSubmit={(event) => handleSubmit(event)}>
        <Row>
          <Col lg={6} md={12}>
            <Form.Group className="mb-4">
              <Form.Label>Wer bist du?</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="first_name"
                  placeholder="Vorname"
                  defaultValue={cookies.userData?.firstName}
                  required
                />
                <Form.Control
                  type="text"
                  name="last_name"
                  placeholder="Nachname"
                  defaultValue={cookies.userData?.lastName}
                  required
                />
              </InputGroup>
              <Form.Text>
                Dein Name, der als Dienstnehmer auf der Stundenliste steht.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col lg={6} md={12}>
            <Form.Group className="mb-4">
              <Form.Label>Für welche Gemeinde arbeitest du?</Form.Label>
              <Form.Control
                type="text"
                name="employer"
                placeholder="Dienstgeber"
                  defaultValue={cookies.userData?.employer}
                required
              />
              <Form.Text>
                Deine Gemeinde, die als Dienstgeber auf der Stundenliste
                auftaucht.
              </Form.Text>
            </Form.Group>
          </Col>
          </Row>
          <Row>
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
            </Col>
        </Row>
        <Row>
          <Col>
            <Form.Check
              type="switch"
              name="use_cookie"
              label="Daten als Cookie speichern, damit's beim nächsten Mal schneller geht" defaultChecked={enableCookie}
              onChange={e => setEnableCookie(e.target.checked)}
            />
          </Col>
          <Col>
            <Button
              variant="primary"
              type="submit"
              className="float-end"
            //   disabled={isLoading}
            >
              {/* {isLoading ? (
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
              ) : ( */}
                <>Weiter</>
              {/* )} */}
            </Button>
          </Col>
        </Row>
      </form>

      {/* {isError && (
        <div className="my-5">
          <MsgBox type="error" trace={error.message}>
            Fehler bei Anfrage ans Backend.
          </MsgBox>
        </div>
      )} */}
    </>
  );
};

export default TSUserData;
