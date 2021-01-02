import {ValidationError} from 'express-validator';
//import {CustomError} from './custom-error';
import {CustomError} from '@wealthface/common';
// interface CustomErrorInterface {
//     statusCode: number;
//     serializeErrors(): {
//         message: string;
//         field?: string;
//     }[]
// }

// Rather then using above we will have abstract class 
export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('Invalid request parameters');

        // Only because we are extending build in class 
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(err => {
            return {message: err.msg, field: err.param}
        });
    }
}

 