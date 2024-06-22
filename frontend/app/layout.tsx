import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Col, Row } from "react-bootstrap";
import Footer from "./components/footer";
import Header from "./components/header";
import { ReactQueryClientProvider } from "./components/react-query-client-provider";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

config.autoAddCss = false;

export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <head>
          <title>KeinPlan</title>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/favicon.ico" />
        </head>
        <body>
          <ReactQueryDevtools initialIsOpen={false} />
          <Row>
            <Col lg={8} className="mx-auto p-4 py-md-5">
              <Header />
              <main>{children}</main>
              <Footer />
            </Col>
          </Row>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
};

export default RootLayout;
