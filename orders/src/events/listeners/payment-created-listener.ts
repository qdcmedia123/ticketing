import {Listener, PaymentCreatedEvent, Subjects, NotFoundError, OrderStatus} from '@wealthface/common';
import {queueGroupName} from './queue-group-name';
import {Message} from 'node-nats-streaming';
import {Order} from '../../models/order';
export class PaymentCreatedListener extends Listener <PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        // Get the data from the event 
        const order = await Order.findById(data.orderId);

        // throw error if order not found 
        if(!order) {
            throw new Error('Order not found');
        }

        // Set the order status to completed 
        order.set({status: OrderStatus.Complete});

        // Save the order 
        await order.save();

        // Ack the message 
        msg.ack();
    }
}