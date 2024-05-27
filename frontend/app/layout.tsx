import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import NavBar from "./components/nav-bar";
import Footer from "./components/footer";
import { ReactQueryClientProvider } from "./components/ReactQueryClientProvider";
import { dom } from "@fortawesome/fontawesome-svg-core";


export const RootLayout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <head>
          <title>foooo</title>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/favicon.ico" />
          <link rel="stylesheet" type="text/css" href="/style.css" />
          <style>{dom.css()}</style>
        </head>
        <body>
          <ReactQueryDevtools initialIsOpen={false} />
          <NavBar />
          <div className="py-4">
            {children}
          </div>
          <Footer />
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}

export default RootLayout;
