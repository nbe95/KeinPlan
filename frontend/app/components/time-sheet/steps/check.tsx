import { useRef } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Id, toast } from "react-toastify";
import { USER_COOKIE_NAME } from "../../../utils/constants";
import MsgBox from "../../msg-box";
import { NextButton, PrevButton } from "../../process-button";
import DateCard from "../date-card";
import { CookieData, TimeSheetDate, TimeSheetParams, UserData } from "../generator";

type CheckProps = {
  userData: UserData;
  timeSheetParams: TimeSheetParams;
  dateList: TimeSheetDate[];
  prevStep: () => void;
  nextStep: () => void;
};

const CheckStep = (props: CheckProps) => {
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
      cookieToast.current = toast.info("Ok! Deine gespeicherten Daten wurden entfernt.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Update timestamp in existing cookie
    if (cookies[USER_COOKIE_NAME]) {
      updateCookie();
    }
    props.nextStep();
  };

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <p className="lead">Fast fertig! Überprüfe bitte kurz deine Termine.</p>
      <p>
        Wenn alles so stimmt, klicke auf <q>Weiter</q>.
      </p>
      <Row className="my-4">
        {props.dateList.length ? (
          props.dateList.map((entry: TimeSheetDate, index: number) => (
            <Col key={index} sm={12} md={6}>
              <DateCard date={entry} />
            </Col>
          ))
        ) : (
          <MsgBox type="info">
            <p className="mb-0">Nanu &ndash; hier sind ja gar keine Termine?!</p>
            <p className="mb-0">
              Macht nichts. Du kannst auch pro forma eine leere Stundenliste erstellen.
            </p>
          </MsgBox>
        )}
      </Row>
      <Row>
        <Col className="mb-4">
          <hr className="col-3 col-md-2 mb-" />
          <Form.Group>
            <Form.Check
              type="switch"
              id="confirm"
              label="Daten speichern, damit's beim nächsten Mal schneller geht."
              onClick={(event) => setResetCookie(event.currentTarget.checked)}
              checked={cookies[USER_COOKIE_NAME]}
            />
            <Form.Text>
              Speichert deine bisherigen Eingaben als Cookie im Browser, damit du sie nicht nochmal
              eintippen musst. Deine Daten sind sicher und bleiben auf diesem Gerät.
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-end order-2">
          <NextButton submit />
        </Col>
        <Col className="d-flex justify-content-start order-1">
          <PrevButton callback={props.prevStep} />
        </Col>
      </Row>
    </form>
  );
};

export default CheckStep;
