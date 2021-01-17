import {Listener, Subjects, OrderCreatedEvent} from '@wealthface/common';
import {queueGroupName} from './queue-group-name';
import {Message} from 'node-nats-streaming';
import {Ticket} from '../../models/ticket';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // React to the ticket collection that the order is reserving 
        const ticket = await Ticket.findById(data.ticket.id);
        // If no ticket throw the error 
        if(!ticket) {
            throw new Error('Ticket not found');
        }

        // Mark the ticket as bein reserved by setting its orderId property
        ticket.set({orderId: data.id});
        // Save the ticket 
        await ticket.save();
        // ack the message
        msg.ack(); 
    }
}

export {OrderCreatedEvent};