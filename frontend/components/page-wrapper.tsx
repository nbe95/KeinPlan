import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import Navigation from "./navigation";
import { PropsWithChildren } from "react";
import { Container } from "react-bootstrap";

type PageProps = {
  title: string;
};

const PageWrapper = (props: PropsWithChildren<PageProps>) => {
  return (
    <>
      <Head>
        <title>KeinPlan {props.title && ` | ${props.title}`}</title>
      </Head>
      <Navigation></Navigation>
      <Container fluid="sm">{props.children}</Container>
    </>
  );
};

export default PageWrapper;
