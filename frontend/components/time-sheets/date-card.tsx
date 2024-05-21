import { Stack } from "react-bootstrap";
import { TimeSheetDate } from "./common";

type DateCardProps = {
  date: TimeSheetDate;
};

export const DateCard = (props: DateCardProps) => {
  const getDateLabel = (date: Date): string => `${date.getDate().toString().padStart(2, "0")}.`;
  const getMonthLabel = (date: Date): string => date.toLocaleString([], { month: "short" });

  const getDurationLabel = (begin: Date, end: Date): string => {
    const beginStr: string = begin.toLocaleTimeString([], {
      hour12: false,
      hour: "numeric",
      minute: "2-digit",
    });
    const endStr: string = end.toLocaleTimeString([], {
      hour12: false,
      hour: "numeric",
      minute: "2-digit",
    });
    return `${beginStr} - ${endStr}`;
  };

  return (
    <Stack direction="horizontal" gap={0} className="my-2 mx-0 d-flex align-items-stretch">
      <div
        className="bg-danger text-white text-center align-content-center border border-dark border-end-0 rounded-start"
        style={{ width: "5em", minWidth: "5em", flex: "unset" }}
      >
        <p className="display-6 m-0">{getDateLabel(props.date.begin)}</p>
        <p className="fs-6 fw-bold m-0">{getMonthLabel(props.date.begin)}</p>
      </div>
      <div className="border border-dark rounded-end px-2 py-1">
        <Stack direction="horizontal" gap={1} className="align-items-start">
          <div className="me-auto">
            <p className="my-0 fw-bold">{props.date.title}</p>
            <p className="my-0">{props.date.role}</p>
            <p className="my-0">
              <small className="text-muted">{props.date.location}</small>
            </p>
          </div>
          <div className="text-end">
            <p className="text-nowrap my-0">{getDurationLabel(props.date.begin, props.date.end)}</p>
            {props.date.breakBegin && props.date.breakEnd && (
              <p className="text-nowrap my-0 text-muted">
                Pause {getDurationLabel(props.date.breakBegin, props.date.breakEnd)}
              </p>
            )}
          </div>
        </Stack>
      </div>
    </Stack>
  );
};

export default DateCard;
