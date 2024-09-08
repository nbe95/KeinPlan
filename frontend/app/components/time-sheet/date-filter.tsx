import { Badge, Nav } from "react-bootstrap";
import strftime from "strftime";
import { addDaysToDate, isSameDay } from "../../utils/dates";

type DateFilterTabProps = {
  eventKey: string;
  title: string;
  disabled: boolean;
  filterValue?: Date;
  badge?: number;

  activeFilter?: Date;
  setActiveFilter: (date?: Date) => void;
};

const FilterTab = (props: DateFilterTabProps) => {
  const isActive =
    props.activeFilter == props.filterValue ||
    (props.activeFilter !== undefined &&
      props.filterValue !== undefined &&
      isSameDay(props.activeFilter, props.filterValue));
  const isDisabled = props.badge === undefined;
  return (
    <Nav.Item>
      <Nav.Link
        eventKey={props.eventKey}
        onClick={() => props.setActiveFilter(props.filterValue)}
        disabled={props.disabled}
        className={isActive ? "text-primary" : isDisabled ? "text-muted" : "text-dark"}
      >
        {props.title}
        {!isDisabled && (
          <Badge bg={isActive ? "primary" : "secondary"} pill className="ms-2 small">
            {props.badge}
          </Badge>
        )}
      </Nav.Link>
    </Nav.Item>
  );
};

type WeekFilterProps = {
  baseDate: Date;
  dateList: Date[];
  activeFilter?: Date;
  setActiveFilter: (date?: Date) => void;
};

export const WeekFilter = (props: WeekFilterProps) => {
  const keyPrefix: string = "week-filter";
  const strftimeGer = strftime.localizeByIdentifier("de_DE");
  return (
    <Nav variant="tabs" defaultActiveKey={`${keyPrefix}all`}>
      <FilterTab
        eventKey={`${keyPrefix}-all`}
        title="Alle"
        disabled={false}
        badge={props.dateList.length}
        activeFilter={props.activeFilter}
        setActiveFilter={() => props.setActiveFilter(undefined)}
      />

      {Array(7)
        .fill(0)
        .map((_, dayOffset) => {
          const day: Date = addDaysToDate(props.baseDate, dayOffset);
          const occurrences: number = props.dateList.filter((date) => isSameDay(date, day)).length;
          return (
            <FilterTab
              key={`${keyPrefix}-${dayOffset}`}
              eventKey={`${keyPrefix}-${dayOffset}`}
              title={strftimeGer("%A", day)}
              disabled={occurrences == 0}
              filterValue={day}
              badge={occurrences || undefined}
              activeFilter={props.activeFilter}
              setActiveFilter={() => props.setActiveFilter(day)}
            />
          );
        })}
    </Nav>
  );
};
