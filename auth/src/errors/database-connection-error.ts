//import {CustomError} from './custom-error';
import {CustomError} from '@wealthface/common';

export class DataBaseConnectionError extends CustomError {
  reason = 'Error connecting to database';
  statusCode = 500;
  constructor() {
    super('Error connecting to db');
    Object.setPrototypeOf(this, DataBaseConnectionError.prototype);
  }

  serializeErrors() {
     return [
       {
         message: this.reason
       }
     ]
  }
}
