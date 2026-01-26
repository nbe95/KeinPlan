import { useState } from "react";
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
  // TODO(Niklas): Form Validierung
  // TODO(Niklas): Form Validierung

  const handleSave = () => {
    props.onSave(editedEvent);
    props.onClose();
  };

  const handleReset = () => {
    setEditedEvent(props.originalEvent);
  };

  // Hilfsfunktion zur Überprüfung, ob das editedEvent vom originalEvent abweicht
  const hasChanges = (): boolean => {
    if (editedEvent.title !== props.originalEvent.title) return true;
    if (editedEvent.role !== props.originalEvent.role) return true;
    if (editedEvent.location !== props.originalEvent.location) return true;

    // Vergleich der Date-Objekte über deren getTime() Wert
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
      <Modal.Header closeButton>
        <Modal.Title>Termin bearbeiten</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate>
          <Row>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label className="d-flex align-items-center">
                <FaTag className="me-2" />
                Titel <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Titel des Ereignisses"
                value={editedEvent.title}
              />
              <Form.Control.Feedback type="invalid">
                Bitte gib einen gültigen Titel ein.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} xs={12} lg={4} className="mb-3" controlId="date">
              <Form.Label className="d-flex align-items-center">
                <FaCalendarDays className="me-2" />
                Datum <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={formatDateForInput(editedEvent.start_date)}
              />
              <Form.Control.Feedback type="invalid">
                Bitte wähle ein gültiges Datum aus.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} xs={6} lg={4} className="mb-3" controlId="startTime">
              <Form.Label className="d-flex align-items-center">
                <FaClock className="me-2" />
                Startzeit <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="time"
                name="start_time"
                value={formatTimeForInput(editedEvent.start_date)}
              />
              <Form.Control.Feedback type="invalid">
                Bitte gibt eine gültige Startzeit ein.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} xs={6} lg={4} className="mb-3" controlId="endTime">
              <Form.Label className="d-flex align-items-center">
                <FaClock className="me-2" />
                Endzeit <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="time"
                name="end_time"
                value={formatTimeForInput(editedEvent.end_date)}
              />
              <Form.Control.Feedback type="invalid">
                Bitte gib eine gültige Endzeit ein.
              </Form.Control.Feedback>
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
                placeholder="Ort des Termins"
                value={editedEvent.location ?? ""}
              />
            </Form.Group>

            <Form.Group as={Col} xs={12} md={6} className="mb-3" controlId="role">
              <Form.Label className="d-flex align-items-center">
                <FaUserTag className="me-2" />
                Rolle
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Deine Rolle oder Funktion"
                name="role"
                value={editedEvent.role ?? ""}
              />
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <IconButton
          icon={FaArrowRotateRight}
          variant="danger"
          onClick={handleReset}
          className="me-auto"
          disabled={!hasChanges()}
        >
          Zurücksetzen
        </IconButton>
        <IconButton icon={FaX} variant="secondary" onClick={props.onClose}>
          Abbrechen
        </IconButton>
        <IconButton icon={FaFloppyDisk} variant="primary" onClick={handleSave}>
          Speichern
        </IconButton>
      </Modal.Footer>
    </Modal>
  );
};

export default DateEditorModal;
