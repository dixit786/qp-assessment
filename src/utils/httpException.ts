import { HttpStatusCode } from './httpStatusCode';

export default class HttpException extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly statusMessage: string;
  public readonly data: any;
  public readonly code: number;
  public readonly keyValue: any;
  public readonly writeErrors: any;

  constructor(statusCode: number, statusMessage: string, error: any = {}) {
    super(statusMessage);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.data = error;
    this.code = error.code || 0;
    this.keyValue = error.keyValue || null;
    this.writeErrors = error.writeErrors || null;

    Error.captureStackTrace(this);
  }
}
