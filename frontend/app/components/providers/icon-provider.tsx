"use client";

import { IconContext } from "react-icons";

export const IconContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <IconContext.Provider value={{ style: { verticalAlign: "" } }}>{children}</IconContext.Provider>
  );
};
