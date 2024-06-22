import { PropsWithChildren } from "react";
import { Col, Row } from "react-bootstrap";

type ContainerProps = {
  className?: string;
};

export const Container = (props: PropsWithChildren<ContainerProps>) => {
  return (
    <div className={props.className}>
      <Row>
        <Col lg={8} className="mx-auto px-4 px-md-5">
          {props.children}
        </Col>
      </Row>
    </div>
  );
};
export default Container;
