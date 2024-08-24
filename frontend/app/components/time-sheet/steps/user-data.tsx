import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Id, toast } from "react-toastify";
import { USER_COOKIE_NAME } from "../../../utils/constants";
import { scrollToElement } from "../../../utils/viewport";
import { NextButton } from "../../process-button";
import { UserData } from "../generator";

type UserDataProps = {
  userData?: UserData;
  setUserData: (data: UserData) => void;
  setKaPlanIcs: (ics: string | undefined) => void;
  nextStep: () => void;
};

const UserDataStep = (props: UserDataProps) => {
  const router = useRouter();
  const handleSubmit = (event) => {
    event.preventDefault();

    const userData: UserData = {
      firstName: event.target.first_name.value,
      lastName: event.target.last_name.value,
      employer: event.target.employer.value,
    };
    props.setUserData(userData);

    // Set or update existing cookie
    if (enableCookie) {
      setCookie(USER_COOKIE_NAME, { ...cookies[USER_COOKIE_NAME], ...userData });
    }
    props.nextStep();
  };

  // Directly focus next button if input data is already present
  useEffect(() => {
    if (props.userData) {
      document.getElementById("btn-next")?.focus({ preventScroll: true });
      scrollToElement("time-sheet", true);
    }
  }, [props.userData]);

  // Cookies
  const cookieToast = useRef<Id | undefined>(undefined);
  const [cookies, setCookie, removeCookie] = useCookies([USER_COOKIE_NAME]);
  const [enableCookie, setEnableCookie] = useState<boolean>(cookies[USER_COOKIE_NAME]);
  const setResetCookie = (enable: boolean) => {
    setEnableCookie(enable);
    if (enable) {
      toast.dismiss(cookieToast.current);
      cookieToast.current = toast.success(
        "Deine Eingaben werden in diesem Browser gespeichert. Beim nächsten Mal sind alle Felder bereits ausgefüllt. 👌",
      );
    } else {
      removeCookie(USER_COOKIE_NAME);
      props.setKaPlanIcs(undefined);
      toast.dismiss(cookieToast.current);
      cookieToast.current = toast.info("OK! Deine gespeicherten Daten wurden entfernt.");
    }
  };

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <p className="lead">First things first &ndash; zuerst die Basics.</p>
      <Row>
        <Col lg={6} md={12} className="mb-4">
          <Form.Group>
            <Form.Label>Wie heißt du?</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                name="first_name"
                placeholder="Vorname"
                defaultValue={props.userData?.firstName}
                required
              />
              <Form.Control
                type="text"
                name="last_name"
                placeholder="Nachname"
                defaultValue={props.userData?.lastName}
                required
              />
            </InputGroup>
            <Form.Text>
              Trage deinen Namen ein, der als Dienstnehmer auf der Stundenliste stehen wird.
            </Form.Text>
          </Form.Group>
        </Col>
        <Col lg={6} md={12} className="mb-4">
          <Form.Group>
            <Form.Label>Für welche Gemeinde arbeitest du?</Form.Label>
            <Form.Control
              type="text"
              name="employer"
              placeholder="Dienstgeber"
              defaultValue={props.userData?.employer}
              required
            />
            <Form.Text>
              Trage den Namen der Pfarrgemeinde ein, der als Dienstgeber auf der Stundenliste
              auftauchen wird.
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col className="mb-4">
          <Form.Group>
            <Form.Check
              type="switch"
              id="confirm"
              label="Alle Eingaben als Cookie speichern"
              onClick={(event) => setResetCookie(event.currentTarget.checked)}
              checked={enableCookie}
            />
            <Form.Text>
              Damit geht&apos;s beim nächsten Mal deutlich schneller und du musst nicht alles
              nochmal eintippen. Deine Daten sind sicher und bleiben auf diesem Gerät.
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col className="d-flex justify-content-end order-1">
          <NextButton submit id="btn-next" />
        </Col>
      </Row>
    </form>
  );
};

export default UserDataStep;
