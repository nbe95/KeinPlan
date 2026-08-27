"use client";

import { ReactNode } from "react";
import { CookiesProvider } from "react-cookie";

// Calculate expiration date once at module load time
const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
const getExpirationDate = (): Date => new Date(Date.now() + ONE_YEAR_MS);

export const CookieProvider = ({ children }: { children: ReactNode }) => {
  const inOneYear: Date = getExpirationDate();
  return (
    <CookiesProvider defaultSetOptions={{ path: "/", expires: inOneYear }}>
      {children}
    </CookiesProvider>
  );
};
