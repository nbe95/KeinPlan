import { faClock, faLocationDot, faMugHot, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "react-bootstrap";
import strftime from "strftime";
import { TimeSheetDate } from "./generator";

type DateCardProps = {
  date: TimeSheetDate;
};

const DateCard = (props: DateCardProps) => {
  const strftimeGer = strftime.localizeByIdentifier("de_DE");

  return (
    <Card
      className="d-flex flex-row my-2 shadow-sm"
      title={`${strftimeGer("%d.%m.%Y", props.date.time.begin)} ${props.date.title ?? "Gottesdienst"}`}
    >
      {props.date.time.begin && (
        <div className="bg-light rounded-start border-end">
          <div className="text-center m-3">
            <p className="badge bg-danger rounded-0 my-0" style={{ textTransform: "uppercase" }}>
              {strftimeGer("%a", props.date.time.begin)}
            </p>
            <p className="text-primary display-6 my-0" style={{ width: "3rem" }}>
              {strftimeGer("%d", props.date.time.begin)}
            </p>
            <p className="badge text-muted border-top border-grey my-0">
              {strftimeGer("%b", props.date.time.begin)}
            </p>
          </div>
        </div>
      )}
      <div className="m-3 text-truncate">
        <div className="h5 fw-bold my-0 text-truncate">{props.date.title ?? "Gottesdienst"}</div>
        <div className="mb-1">
          <div className="d-flex flex-row">
            {props.date.time.begin && props.date.time.end && (
              <>
                <div className="text-muted" style={{ width: "1.5rem" }}>
                  <FontAwesomeIcon icon={faClock} className="text-muted me-2" />
                </div>
                <span>
                  {strftimeGer("%H:%M", props.date.time.begin)} –{" "}
                  {strftimeGer("%H:%M", props.date.time.end)}
                </span>
                {props.date.break?.begin && props.date.break?.end && (
                  <>
                    <div className="text-muted ms-4" style={{ width: "1.5rem" }}>
                      <FontAwesomeIcon icon={faMugHot} className="text-muted me-2" />
                    </div>
                    <span className="text-muted">
                      {strftimeGer("%H:%M", props.date.break.begin)} –{" "}
                      {strftimeGer("%H:%M", props.date.break.end)}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        {props.date.role && (
          <div className="d-flex flex-row">
            <div className="text-muted" style={{ width: "1.5rem" }}>
              <FontAwesomeIcon icon={faUser} />
            </div>
            <span>{props.date.role}</span>
          </div>
        )}
        {props.date.location && (
          <div className="d-flex flex-row small">
            <div className="text-muted" style={{ width: "1.5rem" }}>
              <FontAwesomeIcon icon={faLocationDot} />
            </div>
            <span className="text-muted">{props.date.location}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DateCard;
