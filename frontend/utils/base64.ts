export const b64_encode = (str: string): string => Buffer.from(str, "binary").toString("base64")
export const b64_decode = (str: string): string => Buffer.from(str, 'base64').toString('binary');
