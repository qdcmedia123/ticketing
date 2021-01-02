//import { CustomError } from "./custom-error";
import {CustomError} from '@wealthface/common';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Not Authorized");

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  serializeErrors() {
    return [{ message: "Not Authorized" }];
  }
}
