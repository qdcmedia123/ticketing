import {ExpirationCompleteListener} from '../expiration-complete-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {Ticket} from '../../../models/ticket';
import {Order} from '../../../models/order';
import mongoose from 'mongoose';
import {OrderStatus, ExpirationCompleteEvent} from '@wealthface/common';
import {Message} from 'node-nats-streaming';

const setup = async() => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    // Create ticket 
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 45,
    });

    // Save ticket 
    await ticket.save();

    // Build order 
    const order = Order.build({
        userId: 'asdfasdf',
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket: ticket
    });

    // Save the order 
    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    // Return the required data 
    return {data, order, ticket, msg, listener};
}

it('updateds the order status to cancelled', async() => {

});

it('emit an OrderCancelled event', async() => {

});

it('ack the message', async() => {

});