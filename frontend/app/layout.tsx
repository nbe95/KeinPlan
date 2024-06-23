import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import { ReactQueryClientProvider } from "./components/query-client-provider";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

import "../scss/stepper.scss";

config.autoAddCss = false;

export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryClientProvider>
      <html lang="de">
        <head>
          <title>KeinPlan</title>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/favicon.ico" />
        </head>
        <body>
          <ReactQueryDevtools initialIsOpen={false} />
          <div className="py-1 py-md-2">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
};

export default RootLayout;
