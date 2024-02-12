import { createContext } from "react";
import { API_BASE_URL_SERVER, BACKEND_INFO_CACHE_TIME } from "../constants";

export const BackendInfoContext = createContext({});

export type PageProps = {
  backendInfo: any;
};

export const getBackendInfo = async (res) => {
  res.setHeader("Cache-Control", `private, max-age=${BACKEND_INFO_CACHE_TIME}`);
  try {
    const query = await fetch(`${API_BASE_URL_SERVER}/info`);
    return await query.json();
  } catch (error) {
    return {"error": `${error}`}
  }
};
