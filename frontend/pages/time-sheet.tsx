import { NextPage } from "next";
import PageSection from "../components/page-section";
import PageWrapper from "../components/page-wrapper";
import TimeSheetGenerator from "../components/time-sheets/generator";
import { PageProps, getBackendInfo } from "../utils/backend-info";

const Page: NextPage = (pageProps: PageProps) => {
  return (
    <PageWrapper backendInfo={pageProps.backendInfo} title="Stundenliste">
      <PageSection headline="Stundenliste erstellen">
        <TimeSheetGenerator />
      </PageSection>
    </PageWrapper>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  return {
    props: {
      backendInfo: await getBackendInfo(res),
    },
  };
};

export default Page;
