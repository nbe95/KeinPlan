import { useState } from "react";
import { Badge, Button, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaClock, FaLocationDot, FaPen, FaTrash, FaUser } from "react-icons/fa6";
import strftime from "strftime";
import { isSameDay } from "../../utils/dates";
import DateEditorModal from "./date-editor-modal";
import { Event } from "./generator";

interface DateCardProps {
  date: Event;
  onUpdate: (updatedDate: Event) => void;
}

const DateCard = (props: DateCardProps) => {
  const strftimeGer = strftime.localizeByIdentifier("de_DE");

  const [isHovered, setIsHovered] = useState(false);

  const [currentDate, setCurrentDate] = useState<Event>(props.date);
  const [originalDate, setOriginalDate] = useState<Event>(props.date);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const saveEditedEvent = (editedDate: Event) => {
    setCurrentDate(editedDate);
    props.onUpdate(editedDate);
  };

  const isModified =
    true ||
    currentDate.title !== originalDate.title ||
    !isSameDay(currentDate.start_date, originalDate.start_date);
  currentDate.start_date.getTime() !== originalDate.start_date.getTime() ||
    currentDate.end_date.getTime() !== originalDate.end_date.getTime() ||
    currentDate.role !== originalDate.role ||
    currentDate.location !== originalDate.location;

  return (
    <>
      <OverlayTrigger
        delay={{ show: 500, hide: 0 }}
        overlay={
          <Tooltip>
            {strftimeGer("%d.%m.%Y", currentDate.start_date)} &ndash; {currentDate.title}
          </Tooltip>
        }
      >
        <Card
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="d-flex flex-row my-2 shadow-sm"
          data-uid={currentDate.uid}
        >
          {currentDate.start_date && (
            <div className="bg-light rounded-start border-end">
              <div className="text-center m-3">
                <Badge bg="danger" className="rounded my-0" style={{ textTransform: "uppercase" }}>
                  {strftimeGer("%a", currentDate.start_date)}
                </Badge>
                <p className="text-primary display-6 my-0" style={{ width: "3rem" }}>
                  {strftimeGer("%d", currentDate.start_date)}
                </p>
                <Badge text="muted" bg="none" className="rounded-0 border-top border-grey my-0">
                  {strftimeGer("%b", currentDate.start_date)}
                </Badge>
              </div>
            </div>
          )}
          <div className="m-3 text-truncate flex-grow-1">
            <div className="d-flex flex-row mt-0 mb-1">
              <div className="h5 fw-bold text-truncate flex-grow-1">{currentDate.title}</div>
              <div>
                {isModified && (
                  <Badge
                    bg="danger"
                    text="light"
                    className="fw-normal rounded-pill m-0 px-2 py-1 small"
                  >
                    bearbeitet
                  </Badge>
                )}
              </div>
            </div>
            <div className="d-flex flex-row">
              <div className="flex-grow-1">
                <div className="d-flex flex-row">
                  {currentDate.start_date && currentDate.end_date && (
                    <>
                      <div style={{ width: "1.5rem" }}>
                        <FaClock className="text-secondary me-2" />
                      </div>
                      <span>
                        {strftimeGer("%H:%M", currentDate.start_date)} &ndash;{" "}
                        {strftimeGer("%H:%M", currentDate.end_date)}
                      </span>
                    </>
                  )}
                </div>
                {currentDate.role && (
                  <div className="d-flex flex-row">
                    <div style={{ width: "1.5rem" }}>
                      <FaUser className="text-secondary" />
                    </div>
                    <span>{currentDate.role}</span>
                  </div>
                )}
                {currentDate.location && (
                  <div className="d-flex flex-row small">
                    <div style={{ width: "1.5rem" }}>
                      <FaLocationDot className="text-secondary" />
                    </div>
                    <span className="text-secondary">{currentDate.location}</span>
                  </div>
                )}
              </div>
              <div
                className={`d-flex ${!isHovered && "d-md-none "} flex-row align-items-end gap-2`}
              >
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => setShowEditModal(true)}
                  className="text-secondary rounded-circle m-0"
                >
                  <FaPen />
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => setShowEditModal(true)}
                  className="text-secondary rounded-circle m-0"
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </OverlayTrigger>

      <DateEditorModal
        show={showEditModal}
        event={currentDate}
        originalEvent={originalDate}
        onSave={saveEditedEvent}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
};

export default DateCard;
