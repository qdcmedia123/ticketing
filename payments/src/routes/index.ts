import express, {Request ,Response} from 'express';
import {body} from 'express-validator';
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError
} from '@wealthface/common';

import {Order} from '../models/order';

const router = express.Router();
/* Remember to set this route to ingress nginx this router */
/* Otherwise it will not work */

router.post('/api/payments', 
requireAuth,
[
    body('token')
     .not()
     .isEmpty(),
    body('orderId')
     .not()
     .isEmpty()
],
async (req: Request, res:Response) => {
    res.send({success:true});
})

export {router as createChargeRouter};