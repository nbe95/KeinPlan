import { faCircleInfo, faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Stack } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Id, toast } from "react-toastify";
import strftime from "strftime";
import { b64_encode } from "../../../utils/base64";
import {
  API_ENDPOINT_KAPLAN,
  KAPLAN_ICS_HEADER,
  KAPLAN_LINK,
  KAPLAN_QUERY_KEY,
  KAPLAN_WEB_LINK_TARGET,
  USER_COOKIE_NAME,
} from "../../../utils/constants";
import { addDaysToDate, getIsoWeekAndYear, getMonday, parseDateStr } from "../../../utils/dates";
import { catchQueryError, retryUnlessClientError } from "../../../utils/network";
import { CondLink } from "../../link";
import { NextButton, PrevButton } from "../../process-button";
import { DateEntry, UserData } from "../generator";

interface KaPlanData {
  icsString: string;
  targetDate: Date;
}

type DatesProps = {
  userData: UserData;
  targetDate: Date;
  setTargetDate: (_date: Date) => void;
  kaPlanIcs?: string;
  setKaPlanIcs: (_ics: string) => void;
  setDateList: (_data: DateEntry[]) => void;
  prevStep: () => void;
  nextStep: () => void;
};

const DatesStep = (props: DatesProps) => {
  // Date related stuff
  const getCalWeekLabel = useCallback(
    (): string => `KW ${getIsoWeekAndYear(props.targetDate)}`,
    [props.targetDate],
  );
  const prevWeek = () => {
    props.setTargetDate(addDaysToDate(getMonday(props.targetDate), -7));
  };
  const nextWeek = () => {
    props.setTargetDate(addDaysToDate(getMonday(props.targetDate), 7));
  };
  const getDateStr = (date: Date): string => strftime("%Y-%m-%d", date);

  // Query for KaPlan dates
  const [kaPlanQuery, setKaPlanQuery] = useState<KaPlanData>();
  const { data, isFetching, isSuccess, isError, error } = useQuery({
    queryKey: [KAPLAN_QUERY_KEY, kaPlanQuery],
    queryFn: async () => {
      const startDate = getMonday(kaPlanQuery!.targetDate);
      const endDate = addDaysToDate(startDate, 6);
      return axios
        .get(API_ENDPOINT_KAPLAN, {
          params: {
            from: getDateStr(startDate),
            to: getDateStr(endDate),
          },
          headers: {
            [KAPLAN_ICS_HEADER]: b64_encode(kaPlanQuery!.icsString),
          },
        })
        .then((response) => response.data)
        .catch((error) => catchQueryError(error));
    },
    retry: (count, error) => retryUnlessClientError(error, count, 5),
    select: (data: Record<string, unknown>): DateEntry[] =>
      (data.dates as Array<Record<string, unknown>>)?.map((dateItem): DateEntry => {
        return {
          uid: String(dateItem.uid ?? ""),
          title: String(dateItem.title ?? ""),
          role: String(dateItem.role ?? ""),
          location: String(dateItem.location_short ?? ""),
          start_date: parseDateStr(String(dateItem.begin)),
          end_date: parseDateStr(String(dateItem.end)),
        };
      }),
    staleTime: 1000 * 60 * 10, // 10 minutes until stale
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!kaPlanQuery,
  });

  // Form logic
  const [cookies, setCookie] = useCookies([USER_COOKIE_NAME]);
  const handleSubmit = (event) => {
    event.preventDefault();

    props.setKaPlanIcs(event.target.kaplan_ics.value);
    setKaPlanQuery({ icsString: event.target.kaplan_ics.value, targetDate: props.targetDate });

    // Update existing cookie
    if (cookies[USER_COOKIE_NAME]) {
      setCookie(USER_COOKIE_NAME, {
        ...cookies[USER_COOKIE_NAME],
        kaPlanIcs: event.target.kaplan_ics.value,
      });
    }
  };

  // Toasts
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
    if (isError && error?.message) {
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
  }, [isError, error?.message]);

  // Proceed to next step as soon as KaPlan data is fetched
  useEffect(() => {
    if (isSuccess && data) {
      toast.dismiss(kaPlanToast.current);
      props.setDateList(data);
      props.nextStep();
    }
  }, [isSuccess, data, props]);

  // Directly focus next button if input data is already present (here upon first render)
  useEffect(() => {
    if (props.targetDate && props.kaPlanIcs) {
      document.getElementById("btn-next")?.focus({ preventScroll: true });
    }
  }, [props.targetDate, props.kaPlanIcs]);

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <p className="lead">Als nächstes rufen wir deine Termine vom KaPlan-Server ab.</p>
      <Row>
        <Col className="mb-4">
          <Form.Group>
            <Form.Label>
              Für welche Kalenderwoche möchtest du eine Stundenliste erstellen?
            </Form.Label>
            <InputGroup className="px-auto">
              <Form.Control
                type="date"
                name="target_date"
                placeholder="Datum"
                value={getDateStr(props.targetDate)}
                onChange={(event) => {
                  const date = (event.target as HTMLInputElement).valueAsDate;
                  if (date) {
                    props.setTargetDate(date);
                  }
                }}
                disabled={isFetching}
                required
              />
              <InputGroup.Text>
                <Button
                  type="button"
                  variant="none"
                  className="py-0 border-0"
                  onClick={prevWeek}
                  disabled={isFetching}
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={faMinusCircle} size="lg" />
                </Button>
                {getCalWeekLabel()}
                <Button
                  type="button"
                  variant="none"
                  className="py-0 border-0"
                  onClick={nextWeek}
                  disabled={isFetching}
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={faPlusCircle} size="lg" />
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
              placeholder="https://…"
              defaultValue={props.kaPlanIcs}
              maxLength={2048}
              disabled={isFetching}
              required
            />
            <Form.Text>
              <Stack direction="horizontal" gap={1} className="mb-3">
                <FontAwesomeIcon icon={faCircleInfo} size="lg" className="me-1" />
                <span>
                  Du findest deinen Abonnement-String in{" "}
                  <CondLink
                    condition={!!KAPLAN_LINK}
                    href={`${KAPLAN_LINK}/hilfe.asp#kalenderintegration`}
                    target={KAPLAN_WEB_LINK_TARGET}
                    title="KaPlan Web öffnen"
                  >
                    KaPlan&nbsp;Web
                  </CondLink>{" "}
                  unter <b>Hilfe/Info/Ein&shy;stellungen &rarr; Kalender&shy;integration</b>.
                </span>
              </Stack>
            </Form.Text>
          </Form.Group>
          <p className="mt-4 mb-1">
            Für die Abfrage vom KaPlan-Server ist dein persönlicher Abonnement-String erforderlich.
            Er ermöglicht Lesezugriff auf deine Termine und ändert sich, wenn du z.&nbsp;B. dein
            Passwort änderst. Wie weiter unten beschrieben, wird er nicht gespeichert, sondern nur
            einmalig zur Erstellung deiner Stundenliste verwendet.
          </p>
        </Col>
      </Row>

      <Row>
        <Col className="d-flex justify-content-end order-2">
          <NextButton submit id="btn-next" disabled={isFetching} />
        </Col>
        <Col className="d-flex justify-content-start order-1">
          <PrevButton id="btn-prev" callback={props.prevStep} disabled={isFetching} />
        </Col>
      </Row>
    </form>
  );
};

export default DatesStep;
