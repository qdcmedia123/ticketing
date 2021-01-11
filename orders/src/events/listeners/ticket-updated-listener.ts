import {Message} from 'node-nats-streaming'; 
import {Subjects, TicketUpdatedEvent, Listener} from '@wealthface/common';
import {Ticket} from '../../models/ticket';
import {queueGroupName} from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        // Find the ticket by id 
        const {id} = data;
        const ticket = await Ticket.findById(id);

        // If ticket not found
        if(!ticket) {
            throw new Error('Ticket was not found');
        }

        // Distruct the data 
        const {title, price}  = data;
        // Update the ticket 
        ticket.set({title, price});
        // Save the ticket 
        await ticket.save();
        
        // Ack the message that receive 
        msg.ack();
    }
}