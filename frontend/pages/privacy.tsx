import { NextPage } from "next";
import { Alert } from "react-bootstrap";
import PageSection from "../components/page-section";
import PageWrapper from "../components/page-wrapper";
import { PageProps, getBackendInfo } from "../utils/backend-info";
import MsgBox from "../components/msg-box";

const Page: NextPage = (pageProps: PageProps) => {
  return (
    <PageWrapper backendInfo={pageProps.backendInfo} title="Datenschutz">
      <PageSection headline="Datenschutz">
        <MsgBox type="info">Seite noch im Aufbau.</MsgBox>
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
