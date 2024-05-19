import { Card, CardGroup, Stack } from "react-bootstrap";
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
    <CardGroup className="my-2 mx-0">
      <Card
        bg="danger"
        text="white"
        className="text-center justify-content-center border-dark border-end-0"
        style={{ width: "5em", flex: "unset" }}
      >
        <p className="display-6 m-0">{getDateLabel(props.date.begin)}</p>
        <p className="fs-6 fw-bold m-0">{getMonthLabel(props.date.begin)}</p>
      </Card>
      <Card className="border-dark px-2 py-1">
        <Stack direction="horizontal" gap={2} className="align-items-start">
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
      </Card>
    </CardGroup>
  );
};

export default DateCard;
