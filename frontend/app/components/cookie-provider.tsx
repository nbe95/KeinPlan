"use client";

import { CookiesProvider } from "react-cookie";

export const CookieProvider = ({ children }: { children: React.ReactNode }) => {
  const inOneYear: Date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
  return (
    <CookiesProvider defaultSetOptions={{ path: "/", expires: inOneYear }}>
      {children}
    </CookiesProvider>
  );
};
