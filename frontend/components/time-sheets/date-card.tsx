import { faClock, faLocationDot, faMugHot, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "react-bootstrap";
import strftime from "strftime";
import { TimeSheetDate } from "./common";

type DateCardProps = {
  date: TimeSheetDate;
};

const DateCard = (props: DateCardProps) => {
  const strftimeGer = strftime.localizeByIdentifier("de_DE");
  return (
    <Card className="d-flex flex-row my-2 shadow-sm">
      <div className="bg-light rounded-start border-end">
        <div className="text-center m-3">
          <p className="badge bg-danger rounded-0 my-0" style={{ textTransform: "uppercase" }}>
            {strftimeGer("%a", props.date.begin)}
          </p>
          <p className="text-primary display-6 my-0" style={{ width: "3rem" }}>
            {strftimeGer("%d", props.date.begin)}
          </p>
          <p className="badge text-muted border-top border-grey my-0">
            {strftimeGer("%b", props.date.begin)}
          </p>
        </div>
      </div>
      <div className="mx-3 text-nowrap overflow-auto">
      <div className="m-3 text-truncate">
        <div className="h5 fw-bold my-0 text-truncate">{props.date.title ?? "Gottesdienst"}</div>
          <div className="mb-1">
            <div className="d-flex flex-row">
              <div className="text-muted" style={{ width: "1.5rem" }}>
                <FontAwesomeIcon icon={faClock} className="text-muted me-2" />
              </div>
              <span>
                {strftimeGer("%H:%M", props.date.begin)} - {strftimeGer("%H:%M", props.date.end)}
              </span>
              {props.date.breakBegin && props.date.breakEnd && (
                <>
                  <div className="text-muted ms-4" style={{ width: "1.5rem" }}>
                    <FontAwesomeIcon icon={faMugHot} className="text-muted me-2" />
                  </div>
                  <span className="text-muted">
                    {strftimeGer("%H:%M", props.date.breakBegin)} -{" "}
                    {strftimeGer("%H:%M", props.date.breakEnd)}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="d-flex flex-row">
            <div className="text-muted" style={{ width: "1.5rem" }}>
              <FontAwesomeIcon icon={faUser} />
            </div>
            <span>{props.date.role}</span>
          </div>
          <div className="d-flex flex-row small">
            <div className="text-muted" style={{ width: "1.5rem" }}>
              <FontAwesomeIcon icon={faLocationDot} />
            </div>
            <span className="text-muted">{props.date.location}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DateCard;
