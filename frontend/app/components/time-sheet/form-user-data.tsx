import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { NextButton } from "../process-button";
import { UserData } from "./common";

type FormUserDataProps = {
  userData: UserData;
  setUserData: (data: UserData) => void;
  nextStep: () => void;
};

const FormUserData = (props: FormUserDataProps) => {
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
    <form name="user_data_form" onSubmit={(event) => handleSubmit(event)}>
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
                autoFocus={true}
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
            <Form.Text>Dein Name, der als Dienstnehmer auf der Stundenliste steht.</Form.Text>
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
              Deine Gemeinde, die als Dienstgeber auf der Stundenliste auftaucht.
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-end">
          <NextButton type="submit" />
        </Col>
      </Row>
    </form>
  );
};

export default FormUserData;
