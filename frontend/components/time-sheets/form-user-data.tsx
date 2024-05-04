import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";

import { UserData } from "./common";

type FormUserDataProps = {
  userData: UserData;
  setUserData: (data: UserData) => void;
  nextStep: () => void;
};

export const FormUserData = (props: FormUserDataProps) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    props.setUserData({
      firstName: event.target.first_name.value,
      lastName: event.target.last_name.value,
      employer: event.target.employer.value,
      ...props.userData,
    });
    props.nextStep();
  };

  return (
    <>
      <h3 className="mb-4 mt-5">Schritt 1: First things first</h3>

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
                defaultValue={props.userData?.employer}
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

export default FormUserData;
