import { createContext } from "react";
import { API_ENDPOINT_INFO, BACKEND_INFO_CACHE_TIME } from "./constants";

export const BackendInfoContext = createContext({});

export type PageProps = {
  backendInfo: any;
};

export const getBackendInfo = async (res) => {
  res.setHeader("Cache-Control", `private, max-age=${BACKEND_INFO_CACHE_TIME}`);
  try {
    const query = await fetch(API_ENDPOINT_INFO);
    return await query.json();
  } catch (error) {
    return { error: `${error}` };
  }
};
