import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@wealthface/common";
import {queueGroupName} from './queue-group-name';
import {Message} from 'node-nats-streaming';
import {Order} from '../../models/order';
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject:Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg:Message) {
        console.log('Payments received order created event')
        // Build the order 
        const order = Order.build({
            id: data.id,
            userId: data.userId,
            version: data.version,
            status: data.status,
            price:data.ticket.price
            
        });
        // Save the order 
        await order.save();
        // Ack the message 
        msg.ack();
    }
}
