import { config, dom } from "@fortawesome/fontawesome-svg-core";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import { PropsWithChildren } from "react";
import { BackendInfoContext } from "../utils/backend-info";
import Footer from "./footer";
import Navigation from "./navigation";
import { CookiesProvider } from "react-cookie";

config.autoAddCss = false;

type PageProps = {
  title?: string;
  backendInfo: any;
};

const PageWrapper = (props: PropsWithChildren<PageProps>) => {
  return (
    <BackendInfoContext.Provider value={props.backendInfo}>
      <CookiesProvider>
        <Head>
          <title>KeinPlan {props.title && ` | ${props.title}`}</title>
          <link rel="icon" href="/icon" sizes="any" />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/favicon.ico" />
          <style>{dom.css()}</style>
        </Head>
        <Navigation />
        <div className="py-4">{props.children}</div>
        <Footer />
      </CookiesProvider>
    </BackendInfoContext.Provider>
  );
};

export default PageWrapper;
