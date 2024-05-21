import { Card, Stack } from "react-bootstrap";
import strftime from "strftime";
import { TimeSheetDate } from "./common";

type DateCardProps = {
  date: TimeSheetDate;
};

export const DateCard = (props: DateCardProps) => {
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
        <div className="py-3">
          <span className="h5 fw-bold mt-0">{props.date.title}</span>
          <div className="mb-1">
            <Stack direction="horizontal" gap={3}>
              <span>
                {strftimeGer("%H:%M", props.date.begin)} - {strftimeGer("%H:%M", props.date.end)}
              </span>
              {props.date.breakBegin && props.date.breakEnd && (
                <span className="text-muted">
                  ({strftimeGer("%H:%M", props.date.breakBegin)} -{" "}
                  {strftimeGer("%H:%M", props.date.breakEnd)} Pause)
                </span>
              )}
            </Stack>
          </div>
          <div className="">{props.date.role}</div>
          <div className="small text-muted">{props.date.location}</div>
        </div>
      </div>
    </Card>
  );
};

export default DateCard;
