import {
  faCircleChevronLeft,
  faCircleChevronRight,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { Id, toast } from "react-toastify";
import strftime from "strftime";
import { b64_encode } from "../../../utils/base64";
import { API_ENDPOINT_KAPLAN, KAPLAN_ICS_HEADER, KAPLAN_QUERY_KEY } from "../../../utils/constants";
import { addDaysToDate, getMonday, getWeek, getWeekYear, parseDateStr } from "../../../utils/dates";
import { ClientError, isClientError, retryUnlessClientError } from "../../../utils/network";
import { NextButton, PrevButton } from "../../process-button";
import { TimeSheetDate, TimeSheetParams } from "../generator";

type DatesProps = {
  timeSheetParams?: TimeSheetParams;
  setTimeSheetParams: (data: TimeSheetParams) => void;
  setDateList: (data: TimeSheetDate[]) => void;
  prevStep: () => void;
  nextStep: () => void;
};

const DatesStep = (props: DatesProps) => {
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

  const [queryParams, setQueryParams] = useState<TimeSheetParams>();
  const { data, isFetching, isSuccess, isError, error } = useQuery({
    queryKey: [KAPLAN_QUERY_KEY, queryParams],
    queryFn: async () => {
      const startDate = getMonday(queryParams!.targetDate);
      const endDate = addDaysToDate(startDate, 6);
      return axios
        .get(API_ENDPOINT_KAPLAN, {
          params: {
            from: getDateStr(startDate),
            to: getDateStr(endDate),
          },
          headers: {
            [KAPLAN_ICS_HEADER]: b64_encode(queryParams!.kaPlanIcs),
          },
        })
        .then((response) => response.data)
        .catch((error) => {
          const msg: string =
            error.response?.data?.message ??
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
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!queryParams,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const params: TimeSheetParams = {
      type: "weekly",
      format: "pdf",
      targetDate: targetDate,
      kaPlanIcs: event.target.kaplan_ics.value,
    };
    props.setTimeSheetParams(params);
    setQueryParams(params);
  };

  const kaPlanToast = useRef<Id | undefined>(undefined);
  useEffect(() => {
    if (isFetching) {
      toast.dismiss(kaPlanToast.current);
      kaPlanToast.current = toast.loading("KaPlan-Server wird kontaktiert…", {
        className: "bg-secondary text-white",
      });
    }
  }, [isFetching]);

  useEffect(() => {
    if (isError) {
      setQueryParams(undefined);
      toast.dismiss(kaPlanToast.current);
      kaPlanToast.current = toast.error(
        () => (
          <div>
            <p className="mb-0">
              Fehler bei Anfrage ans Backend. Stimmt dein Abonnement-String? 🤨
            </p>
            <code className="text-white">
              <small>{error.message}</small>
            </code>
          </div>
        ),
        {
          autoClose: false,
        },
      );
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      toast.dismiss(kaPlanToast.current);
      props.setDateList(data);
      props.nextStep();
    }
  }, [isSuccess]);

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <p className="lead">Als nächstes rufen wir deine Termine vom KaPlan-Server ab.</p>
      <Row>
        <Col lg={9} md={12} className="mb-4">
          <Form.Group>
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
                disabled={isFetching}
                required
              />
              <InputGroup.Text>
                <Button
                  variant="none"
                  className="py-0 border-0"
                  onClick={prevWeek}
                  disabled={isFetching}
                >
                  <FontAwesomeIcon icon={faCircleChevronLeft} size="lg" />
                </Button>
                {getCalWeekLabel()}
                <Button
                  variant="none"
                  className="py-0 border-0"
                  onClick={nextWeek}
                  disabled={isFetching}
                >
                  <FontAwesomeIcon icon={faCircleChevronRight} size="lg" />
                </Button>
              </InputGroup.Text>
            </InputGroup>
            <Form.Text>
              Wähle ein beliebiges Datum aus, das innerhalb in der gewünschten Kalenderwoche liegt.
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={12} className="mb-4">
          <Form.Group>
            <Form.Label>Dein persönlicher KaPlan-Abonnement-String</Form.Label>
            <Form.Control
              type="text"
              name="kaplan_ics"
              placeholder=""
              defaultValue={props.timeSheetParams?.kaPlanIcs}
              disabled={isFetching}
              required
            />
            <Form.Text>
              <p>
                <FontAwesomeIcon icon={faCircleInfo} size="lg" className="me-1" />
                Du findest deinen Abonnement-String in KaPlan unter{" "}
                <b>Hilfe/Info/Einstellungen &rarr; Kalenderintegration</b>.
              </p>
            </Form.Text>
          </Form.Group>
          <p className="mb-0 col-xl-10">
            Um deine Termine vom KaPlan-Server abfragen zu können, ist dein persönlicher
            Abonnement-String notwendig. Wie unten beschrieben, wird er niemals gespeichert und nur
            einmalig zur Erstellung der Stundenliste verwendet.
          </p>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-start">
          <PrevButton callback={props.prevStep} disabled={isFetching} />
        </Col>
        <Col className="d-flex justify-content-end">
          <NextButton submit disabled={isFetching} />
        </Col>
      </Row>
    </form>
  );
};

export default DatesStep;
