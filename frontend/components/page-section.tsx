import { config } from "@fortawesome/fontawesome-svg-core";
import "bootstrap/dist/css/bootstrap.min.css";
import { PropsWithChildren } from "react";
import { Container } from "react-bootstrap";
config.autoAddCss = false;

type SectionProps = {
  headline?: string;
};

const PageSection = (props: PropsWithChildren<SectionProps>) => {
  return (
    <Container className="mt-4 mb-5">
      {props.headline && (
        <>
          <h1 className="mb-0">{props.headline}</h1>
          <hr className="mt-2 mb-4" />
        </>
      )}
      {props.children}
    </Container>
  );
};

export default PageSection;
