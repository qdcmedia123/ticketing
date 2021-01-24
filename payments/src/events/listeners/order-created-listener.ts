import {Listener, Subjects, OrderCreatedEvent, OrderStatus} from '@wealthface/common';
import {natsWrapper} from '../../nats-wrapper';
import {queueGroupName} from './queue-group-name';
import {Message} from 'node-nats-streaming';
import {Order} from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const order = Order.build({
            id: data.id,
            userId: data.userId,
            version: data.version,
            price: data.ticket.price,
            status: data.status
        });
        
        await order.save();
        msg.ack();
    }
}