import {Listener, ExpirationCompleteEvent, Subjects, OrderStatus} from '@wealthface/common';
import {natsWrapper} from '../../nats-wrapper';
import {Order} from '../../models/order';
import {queueGroupName} from './queue-group-name';
import {Message} from 'node-nats-streaming';
import {OrderCancelledPublisher} from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        // Lets find the order 
        const order = await Order.findById(data.orderId).populate('ticket');

        // If not order found throw error 
        if(!order) {
            throw new Error('Order not found');
        }

        // Update the order is cancelled 
        order.set({status: OrderStatus.Cancelled});

        // Save the order 
        await order.save();

        // Publish the event so ticket service can listen that order is cancelled 
        await new OrderCancelledPublisher(natsWrapper.client).publish({
            version: order.version,
            id: order.id,
            ticket: {
                id: order.ticket.id
            }
        });

        msg.ack();
    }
}