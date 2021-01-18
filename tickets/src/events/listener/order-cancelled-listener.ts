import {Listener, OrderCancelledEvent, Subjects} from '@wealthface/common';
import {queueGroupName} from './queue-group-name';
import {Message} from 'node-nats-streaming';
import {Ticket} from '../../models/ticket';
import {TicketUpdatedPublisher} from '../publishers/ticket-updated-publisher';
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        // If ticket not ofund 
        if(!ticket) {
            throw new Error('Ticket not found');
        }

        // Created the event 
        ticket.set({orderId: undefined});

        // Save the ticket 
        await ticket.save();

        // Publish the event 
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            orderId: ticket.orderId,
            version: ticket.version,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId
        });
    }
}