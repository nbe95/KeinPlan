import { FormEvent, useEffect, useRef, useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Id, toast } from "react-toastify";
import { USER_COOKIE_NAME } from "../../../utils/constants";
import { scrollToElement } from "../../../utils/viewport";
import { IconButtonNext } from "../../icon-button";
import { UserData } from "../generator";

type UserFormProps = {
  userData?: UserData;
  setUserData: (data: UserData) => void;
  setKaPlanIcs: (ics: string | undefined) => void;
  nextStep: () => void;
};

const UserForm = (props: UserFormProps) => {
  const mainFormRef = useRef<HTMLFormElement>(null);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validation
    const form = event.target as HTMLFormElement;
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      return;
    }

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
      scrollToElement("stepper", true);
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
    <>
      <p className="lead">First things first &ndash; zuerst die Basics.</p>
      <Form ref={mainFormRef} onSubmit={onSubmit} noValidate>
        <Row>
          <Col lg={6} md={12} className="mb-4">
            <Form.Group controlId="name">
              <Form.Label>Wie heißt du?</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="first_name"
                  placeholder="Vorname"
                  defaultValue={props.userData?.firstName}
                  maxLength={45}
                  required
                />
                <Form.Control
                  type="text"
                  name="last_name"
                  placeholder="Nachname"
                  className="rounded-end"
                  defaultValue={props.userData?.lastName}
                  maxLength={45}
                  required
                />
                <Form.Control.Feedback type="invalid">Das kriegst du hin!</Form.Control.Feedback>
              </InputGroup>
              <Form.Text>
                Trage deinen Namen ein, der als Dienstnehmer auf der Stundenliste stehen wird.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col lg={6} md={12} className="mb-4">
            <Form.Group controlId="employer">
              <Form.Label>Für welche Gemeinde arbeitest du?</Form.Label>
              <Form.Control
                type="text"
                name="employer"
                placeholder="Dienstgeber"
                defaultValue={props.userData?.employer}
                maxLength={100}
                minLength={5}
                required
              />
              <Form.Control.Feedback type="invalid">
                Sorry, darf nicht leer sein.
              </Form.Control.Feedback>
              <Form.Text>
                Trage den Namen der Pfarrgemeinde ein, der als Dienstgeber auf der Stundenliste
                auftauchen wird.
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {/* Use an own form to exclude checkbox from validation */}
      <Form>
        <Row>
          <Col className="mb-4">
            <Form.Group controlId="cookie-usage">
              <Form.Check
                type="switch"
                name="use_cookie"
                label="Alle Eingaben als Cookie speichern"
                onChange={(event) => setResetCookie(event.currentTarget.checked)}
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
            <IconButtonNext id="btn-next" onClick={() => mainFormRef.current?.requestSubmit()} />
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default UserForm;
