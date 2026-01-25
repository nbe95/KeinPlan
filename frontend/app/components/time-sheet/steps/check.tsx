import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { getMonday, isSameDay } from "../../../utils/dates";
import { IconButtonNext, IconButtonPrev } from "../../icon-button";
import MsgBox from "../../msg-box";
import DateCard from "../date-card";
import { WeekFilter } from "../date-filter";
import { DateEntry } from "../generator";

type CheckProps = {
  targetDate: Date;
  dateList: DateEntry[];
  updateDate: (updatedDate: DateEntry) => void;
  prevStep: () => void;
  nextStep: () => void;
};

const CheckStep = (props: CheckProps) => {
  const [dateFilter, setDateFilter] = useState<Date>();
  const filteredDates = props.dateList.filter(
    (date) => dateFilter == undefined || isSameDay(date.start_date, dateFilter),
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    props.nextStep();
  };

  // Directly focus next button upon first render
  useEffect(() => {
    document.getElementById("btn-next")?.focus({ preventScroll: true });
  }, []);

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <p className="lead">Fast fertig! Überprüfe kurz deine Termine.</p>
      <p>
        Ändere bei Bedarf ein paar Details oder füge neue Termine hinzu. Wenn alles passt, klicke
        auf <q>Weiter</q>.
      </p>

      <Row className="my-4">
        <Col>
          <WeekFilter
            baseDate={getMonday(props.targetDate)}
            dateList={props.dateList.map((entry) => entry.start_date)}
            activeFilter={dateFilter}
            setActiveFilter={setDateFilter}
          />
        </Col>
      </Row>

      <Row className="my-4">
        {props.dateList.length ? (
          <>
            {filteredDates.map((entry: DateEntry, index: number) => (
              <Col key={index} sm={12} md={6}>
                <DateCard date={entry} onUpdate={props.updateDate} />
              </Col>
            ))}
            {filteredDates.length < props.dateList.length && (
              <div className="mt-2 small text-muted">
                (+{props.dateList.length - filteredDates.length} ausgeblendete)
              </div>
            )}
          </>
        ) : (
          <div>
            <MsgBox type="info">
              <p className="mb-0">Nanu &ndash; hier sind ja gar keine Termine?!</p>
              <p className="mb-0">
                Macht nichts. Du kannst auch pro forma eine leere Stundenliste erstellen.
              </p>
            </MsgBox>
          </div>
        )}
      </Row>
      <Row>
        <Col className="d-flex justify-content-end order-2">
          <IconButtonNext id="btn-next" type="submit" />
        </Col>
        <Col className="d-flex justify-content-start order-1">
          <IconButtonPrev id="btn-prev" onClick={props.prevStep} />
        </Col>
      </Row>
    </form>
  );
};

export default CheckStep;
