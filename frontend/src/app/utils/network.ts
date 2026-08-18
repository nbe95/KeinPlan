import StatusCodes from "http-status-codes";

export class ClientError extends Error {
  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly
    Object.setPrototypeOf(this, ClientError.prototype);
  }
}

interface ApiResponse {
  data: unknown;
  status: number;
}

export const isClientError = (status: number): boolean =>
  status >= StatusCodes.BAD_REQUEST && status < StatusCodes.INTERNAL_SERVER_ERROR;

export const retryUnlessClientError = (
  error: unknown,
  count: number,
  maxRetries: number,
): boolean => !(error instanceof ClientError || count >= maxRetries - 1);

export const catchQueryError = (error: Record<string, unknown>) => {
  const response = error.response as ApiResponse | undefined;
  let msg: string = "Unknown error";

  if (response?.data && typeof response.data === "object") {
    const dataObj = response.data as Record<string, unknown>;
    if (dataObj.message && typeof dataObj.message === "string") {
      msg = dataObj.message;
    } else if (typeof response.data === "string") {
      msg = response.data;
    }
  } else if (typeof response?.data === "string") {
    msg = response.data;
  } else if (response?.status) {
    msg = `The request returned status code ${response.status}`;
  } else if (error.message && typeof error.message === "string") {
    msg = error.message;
  }

  if (response?.status && isClientError(response.status)) {
    throw new ClientError(msg);
  }
  throw Error(msg);
};
