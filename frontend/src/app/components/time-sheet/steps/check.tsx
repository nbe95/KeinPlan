import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { getMonday, isSameDay } from "../../../utils/dates";
import MsgBox from "../../msg-box";
import { NextButton, PrevButton } from "../../process-button";
import DateCard from "../date-card";
import { WeekFilter } from "../date-filter";
import { DateEntry } from "../generator";

type CheckProps = {
  targetDate: Date;
  dateList: DateEntry[];
  prevStep: () => void;
  nextStep: () => void;
};

const CheckStep = (props: CheckProps) => {
  const [dateFilter, setDateFilter] = useState<Date>();

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
      <p className="lead">Fast fertig! Überprüfe bitte kurz deine Termine.</p>
      <p>
        Wenn alles so stimmt, klicke auf <q>Weiter</q>.
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
          props.dateList
            .filter((date) => dateFilter == undefined || isSameDay(date.start_date, dateFilter))
            .map((entry: DateEntry, index: number) => (
              <Col key={index} sm={12} md={6}>
                <DateCard date={entry} />
              </Col>
            ))
        ) : (
          <MsgBox type="info">
            <p className="mb-0">Nanu &ndash; hier sind ja gar keine Termine?!</p>
            <p className="mb-0">
              Macht nichts. Du kannst auch pro forma eine leere Stundenliste erstellen.
            </p>
          </MsgBox>
        )}
      </Row>
      <Row>
        <Col className="d-flex justify-content-end order-2">
          <NextButton submit id="btn-next" />
        </Col>
        <Col className="d-flex justify-content-start order-1">
          <PrevButton id="btn-prev" callback={props.prevStep} />
        </Col>
      </Row>
    </form>
  );
};

export default CheckStep;
