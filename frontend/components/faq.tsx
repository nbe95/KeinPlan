import { PropsWithChildren } from "react";
import { Accordion } from "react-bootstrap";

type FaqItemProps = {
  question: string;
};

export const FaqItem = (props: PropsWithChildren<FaqItemProps>) => {
  const eventKey = props.question;
  return (
    <Accordion.Item eventKey={eventKey}>
      <Accordion.Header>
        <p className="lead mb-0">{props.question}</p>
      </Accordion.Header>
      <Accordion.Body>{props.children}</Accordion.Body>
    </Accordion.Item>
  );
};

export const FaqContainer = (props: PropsWithChildren<{}>) => {
  return <Accordion alwaysOpen={false}>{props.children}</Accordion>;
};
