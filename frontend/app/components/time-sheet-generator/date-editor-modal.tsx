import { FormEvent, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";

import {
  FaArrowRotateRight,
  FaCalendarDays,
  FaClock,
  FaFloppyDisk,
  FaLocationDot,
  FaTag,
  FaUserTag,
  FaX,
} from "react-icons/fa6";

import { formatDateForInput, formatTimeForInput } from "../../utils/dates";
import { IconButton } from "../icon-button";
import { Event } from "./generator";

interface DateEditorModalProps {
  show: boolean;
  event: Event;
  originalEvent: Event;
  onSave: (editedEvent: Event) => void;
  onClose: () => void;
}

const DateEditorModal = (props: DateEditorModalProps) => {
  const [editedEvent, setEditedEvent] = useState<Event>(props.event);

  // TODO(Niklas): Zurücksetzen-Logik -> Komponenten-Hierarchie?

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validation
    const form = event.target as HTMLFormElement;
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      return;
    }

    props.onSave(editedEvent);
    props.onClose();
  };

  const onReset = () => {
    setEditedEvent(props.originalEvent);
  };

  const hasChanges = (): boolean => {
    if (editedEvent.title !== props.originalEvent.title) return true;
    if (editedEvent.role !== props.originalEvent.role) return true;
    if (editedEvent.location !== props.originalEvent.location) return true;

    if (editedEvent.start_date.getTime() !== props.originalEvent.start_date.getTime()) return true;
    if (editedEvent.end_date.getTime() !== props.originalEvent.end_date.getTime()) return true;

    return false;
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onClose}
      centered
      size="lg"
      fullscreen="sm-down"
      backdrop="static"
    >
      <Form onSubmit={onSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>Termin bearbeiten</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label className="d-flex align-items-center">
                <FaTag className="me-2" />
                Titel
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Was ist passiert?"
                defaultValue={editedEvent.title}
                maxLength={50}
                minLength={3}
                required
              />
              <Form.Control.Feedback type="invalid">
                Was wäre ein Termin ohne einen guten Titel?
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} xs={12} lg={4} className="mb-3" controlId="date">
              <Form.Label className="d-flex align-items-center">
                <FaCalendarDays className="me-2" />
                Datum
              </Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                defaultValue={formatDateForInput(editedEvent.start_date)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Wähle ein gültiges Datum aus.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} xs={6} lg={4} className="mb-3" controlId="startTime">
              <Form.Label className="d-flex align-items-center">
                <FaClock className="me-2" />
                Startzeit
              </Form.Label>
              <Form.Control
                type="time"
                name="start_time"
                defaultValue={formatTimeForInput(editedEvent.start_date)}
                required
              />
              <Form.Control.Feedback type="invalid">Ungültige Eingabe.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} xs={6} lg={4} className="mb-3" controlId="endTime">
              <Form.Label className="d-flex align-items-center">
                <FaClock className="me-2" />
                Endzeit
              </Form.Label>
              <Form.Control
                type="time"
                name="end_time"
                defaultValue={formatTimeForInput(editedEvent.end_date)}
                required
              />
              <Form.Control.Feedback type="invalid">Ungültige Eingabe.</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} xs={12} md={6} className="mb-3" controlId="location">
              <Form.Label className="d-flex align-items-center">
                <FaLocationDot className="me-2" />
                Ort
              </Form.Label>
              <Form.Control
                type="text"
                name="location"
                placeholder="Wo war das?"
                defaultValue={editedEvent.location ?? ""}
                maxLength={50}
              />
            </Form.Group>

            <Form.Group as={Col} xs={12} md={6} className="mb-3" controlId="role">
              <Form.Label className="d-flex align-items-center">
                <FaUserTag className="me-2" />
                Rolle
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Was hast du da gemacht?"
                name="role"
                defaultValue={editedEvent.role ?? ""}
                maxLength={50}
              />
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <IconButton
            icon={FaArrowRotateRight}
            variant="danger"
            onClick={onReset}
            className="me-auto"
            disabled={!hasChanges()}
          >
            Zurücksetzen
          </IconButton>
          <IconButton icon={FaX} variant="secondary" onClick={props.onClose}>
            Abbrechen
          </IconButton>
          <IconButton icon={FaFloppyDisk} type="submit" variant="primary">
            Speichern
          </IconButton>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default DateEditorModal;
