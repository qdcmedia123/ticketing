import {Listener, OrderCancelledEvent, Subjects } from '@wealthface/common'
import {Ticket} from '../../models/ticket';
import {Message} from 'node-nats-streaming';
import {queueGroupName} from './queue-group-name';
import {TicketUpdatedPublisher} from '../publishers/ticket-updated-publisher';
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        // Find the ticket 
        const ticket = await Ticket.findById(data.ticket.id);

        // Throw error if ticket not found 
        if(!ticket) {
            throw new Error('Ticket not found');
        }

        // Lets updated the ticket model 
        ticket.set({orderId: undefined});
        await ticket.save();

        // Again publish that ticket is updated 
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            version: ticket.version,
            userId:ticket.userId,
            price: ticket.price,
            title: ticket.title,
        });

        msg.ack();

    }
}