import { NextPage } from "next";
import MsgBox from "../components/msg-box";
import PageSection from "../components/page-section";
import PageWrapper from "../components/page-wrapper";

const Page: NextPage = () => {
  return (
    <PageWrapper title="Datenschutz">
      <PageSection headline="Datenschutz">
        <MsgBox type="info">Seite noch im Aufbau.</MsgBox>
      </PageSection>
    </PageWrapper>
  );
};

export default Page;
