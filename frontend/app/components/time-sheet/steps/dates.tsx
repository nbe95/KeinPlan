import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Stack } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { FaCircleInfo, FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
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
import { IconButtonNext, IconButtonPrev } from "../../icon-button";
import { CondLink } from "../../link";
import { DateEntry, UserData } from "../generator";

interface KaPlanData {
  icsString: string;
  targetDate: Date;
}

type DatesProps = {
  userData: UserData;
  targetDate: Date;
  setTargetDate: (date: Date) => void;
  kaPlanIcs?: string;
  setKaPlanIcs: (ics: string) => void;
  setDateList: (data: DateEntry[]) => void;
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
    select: (data: any): DateEntry[] =>
      data.dates?.map((date: any): DateEntry => {
        return {
          uid: date.uid ?? "",
          title: date.title ?? "",
          role: date.role ?? "",
          location: date.location_short ?? "",
          start_date: parseDateStr(date.begin),
          end_date: parseDateStr(date.end),
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
    if (isError) {
      setKaPlanQuery(undefined);
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

  // Proceed to next step as soon as KaPlan data is fetched
  useEffect(() => {
    if (isSuccess) {
      toast.dismiss(kaPlanToast.current);
      props.setDateList(data);
      props.nextStep();
    }
  }, [isSuccess]);

  // Directly focus next button if input data is already present (here upon first render)
  useEffect(() => {
    if (props.targetDate && props.kaPlanIcs) {
      document.getElementById("btn-next")?.focus({ preventScroll: true });
    }
  }, []);

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <p className="lead">Als nächstes rufen wir deine Termine vom KaPlan-Server ab.</p>
      <Row>
        <Col className="mb-4">
          <Form.Group controlId="cal-week">
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
                  <FaCircleMinus size="1.2em" />
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
                  <FaCirclePlus size="1.2em" />
                </Button>
              </InputGroup.Text>
            </InputGroup>
            <Form.Text>
              Wähle ein beliebiges Datum aus, das innerhalb in der gewünschten Kalenderwoche liegt.
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={12} className="mb-4">
          <Form.Group controlId="kaplan">
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
                <FaCircleInfo size="1.3em" className="me-1" />
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
          <IconButtonNext id="btn-next" type="submit" disabled={isFetching} />
        </Col>
        <Col className="d-flex justify-content-start order-1">
          <IconButtonPrev id="btn-prev" onClick={props.prevStep} disabled={isFetching} />
        </Col>
      </Row>
    </form>
  );
};

export default DatesStep;
