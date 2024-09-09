import { config } from "@fortawesome/fontawesome-svg-core";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Slide, ToastContainer } from "react-toastify";
import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import { ReactQueryClientProvider } from "./components/query-client-provider";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Metadata } from "next";
import { PublicEnvScript } from "next-runtime-env";
import "react-toastify/dist/ReactToastify.css";
import "../scss/stepper.scss";
import { CookieProvider } from "./components/cookie-provider";

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "KeinPlan",
  description: "Erstelle Stundenlisten aus KaPlan, vollautomatisch in nur 1 Minute.",
  keywords: [
    "KaPlan",
    "Arbeitszeit",
    "Auflistung",
    "Stundenliste",
    "Stundenzettel",
    "Generator",
    "Pfarrbüro",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryClientProvider>
      <CookieProvider>
        <html lang="de">
          <head>
            {/* Special thanks to https://gauger.io/fonticon and https://realfavicongenerator.net */}
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
            <meta name="msapplication-TileColor" content="#2d89ef" />
            <meta name="theme-color" content="#ffffff" />
            <PublicEnvScript />
          </head>
          <body>
            <ReactQueryDevtools initialIsOpen={false} />
            <div className="py-1 py-md-2">
              <Header />
              <main>{children}</main>
              <Footer />
            </div>
            <ToastContainer
              theme="colored"
              position="bottom-center"
              transition={Slide}
              style={{ width: "660px", maxWidth: "100%" }}
            />
          </body>
        </html>
      </CookieProvider>
    </ReactQueryClientProvider>
  );
}
