import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { NextButton } from "../../process-button";
import { UserData } from "../generator";

type UserDataProps = {
  userData?: UserData;
  setUserData: (data: UserData) => void;
  nextStep: () => void;
};

const UserDataStep = (props: UserDataProps) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    props.setUserData({
      firstName: event.target.first_name.value,
      lastName: event.target.last_name.value,
      employer: event.target.employer.value,
    });
    props.nextStep();
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
        <Col className="d-flex justify-content-end">
          <NextButton submit />
        </Col>
      </Row>
    </form>
  );
};

export default UserDataStep;
