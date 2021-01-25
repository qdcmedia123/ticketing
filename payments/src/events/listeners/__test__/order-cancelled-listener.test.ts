import {OrderCancelledEvent, OrderStatus} from '@wealthface/common';
import {natsWrapper} from '../../../nats-wrapper';
import {OrderCancelledListener} from '../../listeners/order-cancelled-listener';
import {Order} from '../../../models/order';
import mongoose  from 'mongoose';
import {Message} from 'node-nats-streaming';

const setup = async() => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    // Create the order create event 
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        price: 14,
        userId: '34'
    });
    await order.save();

    const data: OrderCancelledEvent['data'] = {
        version: order.version + 1,
        id: order.id,
        ticket: {
            id: 'wesdfsdf'
        }
    };

    // Create the message 
    // @ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    // Return the objects 
    return {listener, data, msg, order }
    
}

it('update the status of the order', async() => {
    const {listener, data, msg, order}  = await setup();
    await listener.onMessage(data, msg);
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('ack the mssage', async() => {
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});