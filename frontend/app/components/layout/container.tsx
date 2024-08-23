import { PropsWithChildren } from "react";
import { Col, Row } from "react-bootstrap";

type ContainerProps = {
  className?: string;
  id?: string;
};

export const Container = (props: PropsWithChildren<ContainerProps>) => {
  return (
    <div className={props.className} id={props.id}>
      <Row className="mx-auto">
        <Col lg={8} className="mx-auto px-4 px-md-5 py-3 py-sm-4">
          {props.children}
        </Col>
      </Row>
    </div>
  );
};
export default Container;
