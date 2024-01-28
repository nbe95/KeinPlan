import { config, dom } from "@fortawesome/fontawesome-svg-core";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import { PropsWithChildren } from "react";
import Footer from "./footer";
import Navigation from "./navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

config.autoAddCss = false;
const queryClient = new QueryClient();

type PageProps = {
  title?: string;
};

const PageWrapper = (props: PropsWithChildren<PageProps>) => {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default PageWrapper;
