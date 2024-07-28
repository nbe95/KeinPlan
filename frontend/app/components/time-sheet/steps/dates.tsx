import {
  faCircleChevronLeft,
  faCircleChevronRight,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Stack } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Id, toast } from "react-toastify";
import strftime from "strftime";
import { b64_encode } from "../../../utils/base64";
import {
  API_ENDPOINT_KAPLAN,
  KAPLAN_ICS_HEADER,
  KAPLAN_QUERY_KEY,
  USER_COOKIE_NAME,
} from "../../../utils/constants";
import { addDaysToDate, getMonday, getWeek, getWeekYear, parseDateStr } from "../../../utils/dates";
import { catchQueryError, retryUnlessClientError } from "../../../utils/network";
import { NextButton, PrevButton } from "../../process-button";
import { CookieData, TimeSheetDate, TimeSheetParams, UserData } from "../generator";

type DatesProps = {
  userData: UserData;
  timeSheetParams?: TimeSheetParams;
  setTimeSheetParams: (data: TimeSheetParams) => void;
  setDateList: (data: TimeSheetDate[]) => void;
  prevStep: () => void;
  nextStep: () => void;
};

const DatesStep = (props: DatesProps) => {
  // Date related stuff
  const fiveDaysAgo = addDaysToDate(new Date(), -5);
  const [targetDate, setTargetDate] = useState(
    props.timeSheetParams?.targetDate ?? getMonday(fiveDaysAgo),
  );
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

  // Query for KaPlan dates
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
        .catch((error) => catchQueryError(error));
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

  // Form logic
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

    // Update existing cookie
    if (cookies[USER_COOKIE_NAME]) {
      updateCookie();
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

  // Proceed to next step as soon as KaPlan data is fetched
  const router = useRouter();
  useEffect(() => {
    if (isSuccess) {
      toast.dismiss(kaPlanToast.current);
      props.setDateList(data);
      props.nextStep();
      router.push("#time-sheet");
    }
  }, [isSuccess]);

  // Cookies
  const [cookies, setCookie, removeCookie] = useCookies([USER_COOKIE_NAME]);
  const updateCookie = (): void => {
    const cookie: CookieData = { userData: props.userData, timeSheetParams: props.timeSheetParams };
    setCookie(USER_COOKIE_NAME, cookie);
  };

  const cookieToast = useRef<Id | undefined>(undefined);
  const setResetCookie = (store: boolean): void => {
    if (store) {
      updateCookie();
      toast.dismiss(cookieToast.current);
      cookieToast.current = toast.success(
        "Deine Daten sind nun in diesem Browser gespeichert. Wenn du das nächste Mal vorbeischaust, sind alle Felder bereits ausgefüllt. 👌",
      );
    } else {
      removeCookie(USER_COOKIE_NAME);
      toast.dismiss(cookieToast.current);
      cookieToast.current = toast.info("OK! Deine gespeicherten Daten wurden entfernt.");
    }
  };

  // Directly focus next button if input data is already present
  useEffect(() => {
    if (props.timeSheetParams) {
      document.getElementById("btn-next")?.focus();
    }
  }, [props.timeSheetParams]);

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
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={faCircleChevronLeft} size="lg" />
                </Button>
                {getCalWeekLabel()}
                <Button
                  variant="none"
                  className="py-0 border-0"
                  onClick={nextWeek}
                  disabled={isFetching}
                  tabIndex={-1}
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
              <Stack direction="horizontal" gap={1} className="mb-3">
                <FontAwesomeIcon icon={faCircleInfo} size="lg" className="me-1" />
                <span>
                  Du findest deinen Abonnement-String in KaPlan unter{" "}
                  <b>Hilfe/Info/Ein&shy;stellungen &rarr; Kalender&shy;integration</b>.
                </span>
              </Stack>
            </Form.Text>
          </Form.Group>
          <p className="mt-4 mb-1">
            Um deine Termine vom KaPlan-Server abfragen zu können, ist dein persönlicher
            Abonnement-String notwendig. Dieser ermöglicht Lesezugriff auf deine Termine und ändert
            sich, wenn du z.&nbsp;B. dein Passwort änderst.
            <br />
            Wie weiter unten beschrieben, wird er nicht dauerhaft gespeichert, sondern nur einmalig
            zur Erstellung deiner Stundenliste verwendet.
          </p>
        </Col>
      </Row>

      <Row>
        <Col className="mb-4">
          <hr className="col-3 col-md-2" />
          <Form.Group>
            <Form.Check
              type="switch"
              id="confirm"
              label="Daten als Cookie speichern, damit's beim nächsten Mal schneller geht."
              onClick={(event) => setResetCookie(event.currentTarget.checked)}
              checked={cookies[USER_COOKIE_NAME]}
            />
            <Form.Text>
              Speichert deine bisherigen Eingaben im Browser, damit du sie nicht nochmal eintippen
              musst. Deine Daten sind sicher und bleiben auf diesem Gerät.
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col className="d-flex justify-content-end order-2">
          <NextButton submit id="btn-next" disabled={isFetching} />
        </Col>
        <Col className="d-flex justify-content-start order-1">
          <PrevButton callback={props.prevStep} disabled={isFetching} />
        </Col>
      </Row>
    </form>
  );
};

export default DatesStep;
