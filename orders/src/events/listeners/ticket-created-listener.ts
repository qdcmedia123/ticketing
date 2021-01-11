import {Message} from 'node-nats-streaming';
import {Subjects, Listener, TicketCreatedEvent} from '@wealthface/common';
import {Ticket} from '../../models/ticket';
import {queueGroupName} from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    // Assigning subject 
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    
    // Queue group name 
    queueGroupName = queueGroupName;

    // On message 
    // @param data sent by event and Message 
    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const {title, price, id} = data;
        
        // Build the ticket 
        const ticket = Ticket.build({
            id, title,price
        })
        // Save the ticket 
        await ticket.save();
        // Acknowledge the ticket 
        msg.ack();
    }
}
