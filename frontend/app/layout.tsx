import { config } from "@fortawesome/fontawesome-svg-core";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Bounce, ToastContainer } from "react-toastify";
import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import { ReactQueryClientProvider } from "./components/query-client-provider";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "../style/stepper.scss";
import "../style/toast.css";

config.autoAddCss = false;

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          <ToastContainer theme="colored" position="bottom-center" transition={Bounce} />
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
