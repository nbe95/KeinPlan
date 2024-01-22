import { NextPage } from "next";
import { Alert } from "react-bootstrap";
import PageWrapper from "../components/page-wrapper";
import PageSection from "../components/page-section";

const Page: NextPage = () => {
  return (
    <PageWrapper title="Datenschutz">
      <PageSection headline="Datenschutz">
        <Alert variant="warning">Seite noch im Aufbau.</Alert>
      </PageSection>
    </PageWrapper>
  );
};

export default Page;
