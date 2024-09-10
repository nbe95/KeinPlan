import { ComponentType, createElement } from "react";
import { Badge, Dropdown, Nav } from "react-bootstrap";
import strftime from "strftime";
import { addDaysToDate, isSameDay } from "../../utils/dates";

type FilterProps = {
  as: ComponentType<any>;
  eventKey: string;
  title: string;
  disabled: boolean;
  filterValue?: Date;
  badge?: number;
  className?: string;
  activeFilter?: Date;
  setActiveFilter: (date?: Date) => void;
};

const FilterItem = (props: FilterProps) => {
  const isActive =
    props.activeFilter == props.filterValue ||
    (props.activeFilter !== undefined &&
      props.filterValue !== undefined &&
      isSameDay(props.activeFilter, props.filterValue));
  const isDisabled = props.badge === undefined;

  let className = props.className;
  if (props.as == Nav.Link) {
    className += ` ${isActive ? "text-primary" : isDisabled ? "text-muted" : "text-dark"}`;
  }

  return createElement(
    props.as,
    {
      active: isActive,
      eventKey: props.eventKey,
      onClick: () => props.setActiveFilter(props.filterValue),
      disabled: props.disabled,
      className: className,
      style: { whiteSpace: "nowrap" },
    },
    [
      <>
        {props.title}
        {!isDisabled && (
          <Badge
            bg={isActive && props.as == Nav.Link ? "primary" : "secondary"}
            pill
            className="ms-2 small"
          >
            {props.badge}
          </Badge>
        )}
      </>,
    ],
  );
};

type WeekFilterProps = {
  baseDate: Date;
  dateList: Date[];
  activeFilter?: Date;
  setActiveFilter: (date?: Date) => void;
};

export const WeekFilter = (props: WeekFilterProps) => {
  const keyPrefix: string = "week-filter-";
  const strftimeGer = strftime.localizeByIdentifier("de_DE");

  const forEachDay = (fn: (key: string, day: Date, occurrences: number) => any): any =>
    Array(7)
      .fill(0)
      .map((_, dayOffset) => {
        const key: string = `${keyPrefix}-${dayOffset}`;
        const day: Date = addDaysToDate(props.baseDate, dayOffset);
        const occurrences: number = props.dateList.filter((date) => isSameDay(date, day)).length;
        return fn(key, day, occurrences);
      });

  return (
    <Nav variant="tabs" defaultActiveKey={keyPrefix + "all"} className="flex-nowrap">
      <Nav.Item>
        <FilterItem
          as={Nav.Link}
          eventKey={keyPrefix + "all"}
          title="Alle"
          disabled={false}
          badge={props.dateList.length}
          activeFilter={props.activeFilter}
          setActiveFilter={() => props.setActiveFilter(undefined)}
        />
      </Nav.Item>

      {forEachDay((key, day, occurrences) => (
        <Nav.Item key={key}>
          <FilterItem
            as={Nav.Link}
            eventKey={key}
            title={strftimeGer("%A", day)}
            disabled={occurrences == 0}
            filterValue={day}
            badge={occurrences || undefined}
            activeFilter={props.activeFilter}
            setActiveFilter={() => props.setActiveFilter(day)}
            className="d-none d-lg-block"
          />
        </Nav.Item>
      ))}

      <Dropdown as={Nav.Item} className="d-block d-lg-none">
        <Dropdown.Toggle
          as={Nav.Link}
          active={props.activeFilter !== undefined}
          className={props.activeFilter !== undefined ? "text-primary" : "text-dark"}
        >
          Filter…
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {forEachDay((key, day, occurrences) => (
            <FilterItem
              as={Dropdown.Item}
              key={key}
              eventKey={key}
              title={strftimeGer("%A", day)}
              disabled={occurrences == 0}
              filterValue={day}
              badge={occurrences || undefined}
              activeFilter={props.activeFilter}
              setActiveFilter={() => props.setActiveFilter(day)}
            />
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </Nav>
  );
};
