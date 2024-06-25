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
