import express, {Request ,Response} from 'express';
import {body} from 'express-validator';
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError,
    NotAuthorizedError,
    OrderStatus,
} from '@wealthface/common';

import {Order} from '../models/order';
import {stripe} from '../stripe';

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
validateRequest,
async (req: Request, res:Response) => {
    // Distruct the token and order id 
    const {token, orderId} = req.body;
    // Find the order by orderId
    const order = await Order.findById(orderId);
    // Throw error if order not found 
    if(!order) {
        throw new NotFoundError();
    }
    // Throw error is order.userId !== req.currenctUser.id
    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    // Order status must not be cancelled 
    if(order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Can not pay for expired order');
    }

    await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token
    });

    res.status(201).json({sucess:true})
})

export {router as createChargeRouter};