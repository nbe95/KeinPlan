import { NextPage } from "next";
import PageSection from "../components/page-section";
import PageWrapper from "../components/page-wrapper";
import TimeSheetGenerator from "../components/time-sheets/generator";

const Page: NextPage = () => {
  return (
    <PageWrapper title="Stundenliste">
      <PageSection headline="Stundenliste erstellen">
        <TimeSheetGenerator />
      </PageSection>
    </PageWrapper>
  );
};

export default Page;
