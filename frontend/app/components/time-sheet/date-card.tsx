import { useState } from "react";
import { Badge, Button, Card } from "react-bootstrap";
import { FaClock, FaLocationDot, FaPen, FaTrash, FaUser } from "react-icons/fa6";
import strftime from "strftime";
import { isSameDay } from "../../utils/dates";
import DateEditorModal from "./date-editor-modal";
import { DateEntry } from "./generator";

interface DateCardProps {
  date: DateEntry;
  onUpdate: (updatedDate: DateEntry) => void;
}

const DateCard = (props: DateCardProps) => {
  const strftimeGer = strftime.localizeByIdentifier("de_DE");

  const [isHovered, setIsHovered] = useState(false);

  const [currentDate, setCurrentDate] = useState<DateEntry>(props.date);
  const [originalDate, setOriginalDate] = useState<DateEntry>(props.date);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const saveEditedEvent = (editedDate: DateEntry) => {
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
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="d-flex flex-row my-2 shadow-sm"
        title={`${strftimeGer("%d.%m.%Y", currentDate.start_date)} ${currentDate.title}`}
        data-uid={currentDate.uid}
      >
        {currentDate.start_date && (
          <div className="bg-light rounded-start border-end">
            <div className="text-center m-3">
              <p className="badge bg-danger rounded my-0" style={{ textTransform: "uppercase" }}>
                {strftimeGer("%a", currentDate.start_date)}
              </p>
              <p className="text-primary display-6 my-0" style={{ width: "3rem" }}>
                {strftimeGer("%d", currentDate.start_date)}
              </p>
              <p className="badge rounded-0 text-muted border-top border-grey my-0">
                {strftimeGer("%b", currentDate.start_date)}
              </p>
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
                      {strftimeGer("%H:%M", currentDate.start_date)} –{" "}
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
            <div className={`d-flex ${!isHovered && "d-md-none "} flex-row align-items-end gap-2`}>
              <Button
                variant="light"
                size="sm"
                title="Termin bearbeiten"
                onClick={() => setShowEditModal(true)}
                className="text-secondary rounded-circle m-0"
              >
                <FaPen />
              </Button>
              <Button
                variant="light"
                size="sm"
                title="Termin löschen"
                onClick={() => setShowEditModal(true)}
                className="text-secondary rounded-circle m-0"
              >
                <FaTrash />
              </Button>
            </div>
          </div>
        </div>
      </Card>

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
