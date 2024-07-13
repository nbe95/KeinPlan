import StatusCodes from "http-status-codes";

export class ClientError extends Error {
  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly
    Object.setPrototypeOf(this, ClientError.prototype);
  }
}

export const isClientError = (status: number): boolean =>
  status >= StatusCodes.BAD_REQUEST && status < StatusCodes.INTERNAL_SERVER_ERROR;

export const retryUnlessClientError = (error, count, maxRetries): boolean =>
  !(error instanceof ClientError || count >= maxRetries - 1);

export const catchQueryError = (error: any) => {
  const msg: string =
    error.response?.data?.message ??
    error.response?.data ??
    (error.response?.status
      ? `The request returned status code ${error.response?.status}`
      : error.message ?? "Unknown error");
  if (isClientError(error.response?.status)) {
    throw new ClientError(msg);
  }
  throw Error(msg);
};
