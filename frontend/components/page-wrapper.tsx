import { config, dom } from "@fortawesome/fontawesome-svg-core";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import { PropsWithChildren } from "react";
import { Container } from "react-bootstrap";
import Navigation from "./navigation";
config.autoAddCss = false;

type PageProps = {
  title?: string;
  headline?: string;
};

const PageWrapper = (props: PropsWithChildren<PageProps>) => {
  return (
    <>
      <Head>
        <title>KeinPlan {props.title && ` | ${props.title}`}</title>
        <link rel="icon" href="/icon" sizes="any" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <style>{dom.css()}</style>
      </Head>
      <Navigation></Navigation>
      <Container className="container-sm py-5">
        {props.headline && <h1 className="mb-4">{props.headline}</h1>}
        {props.children}
      </Container>
    </>
  );
};

export default PageWrapper;