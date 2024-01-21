import { NextPage } from "next";
import { Alert } from "react-bootstrap";
import PageWrapper from "../components/page-wrapper";

const Page: NextPage = () => {
  return (
    <PageWrapper title="AutoMailer" headline="AutoMailer">
      <Alert variant="warning">Seite noch im Aufbau.</Alert>
    </PageWrapper>
  );
};

export default Page;
