import { config, dom } from "@fortawesome/fontawesome-svg-core";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import { PropsWithChildren } from "react";
import { Container } from "react-bootstrap";
import { Footer } from "./footer";
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
      <Container className="py-5 mb-4">
        {props.headline && (
          <>
            <h1 className="mb-0">{props.headline}</h1>
            <hr className="mt-2 mb-4" />
          </>
        )}
        {props.children}
      </Container>
      <Footer />
    </>
  );
};

export default PageWrapper;
