import { config, dom } from "@fortawesome/fontawesome-svg-core";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import { PropsWithChildren } from "react";
import { Container } from "react-bootstrap";
import { Footer } from "./footer";
import Navigation from "./navigation";
config.autoAddCss = false;

type SectionProps = {
  headline?: string;
};

const PageSection = (props: PropsWithChildren<SectionProps>) => {
  return (
    <Container className="my-4">
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
