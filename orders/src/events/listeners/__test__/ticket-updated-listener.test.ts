import {TicketUpdatedEvent} from '@wealthface/common';
import {Ticket} from '../../../models/ticket';
import {Message} from 'node-nats-streaming';
import {TicketUpdatedListener} from '../ticket-updated-listener';
import {natsWrapper} from '../../../nats-wrapper';
import mongoose from 'mongoose';

const setup = async() => {
    // Create a listener 
    const listener = new TicketUpdatedListener(natsWrapper.client);
    // Create and save a ticket 
    const ticket =  Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 4,
        
    });

    // Save the ticket 
    await ticket.save();

    // Create a fack data object 
    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version+1,
        id: ticket.id,
        title: 'new conde',
        price: 45,
        userId: '345345'
    }

    // Create fake message object 
    // @ts-ignore
    const msg:Message = {
        ack:jest.fn()
    }
    
    // Return all of stuff 
    return {listener, ticket, data, msg};
}

it('finds, updated, and saves a ticket', async() => {
    const {listener, data, ticket, msg} = await setup();

    // Publish the message 
    await listener.onMessage(data, msg);

    // Find ticket by id 
    const updatedTicket = await Ticket.findById(ticket.id);

    // Expection 
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async() => {
    const {listener, data, msg, ticket}  = await setup();

    // Publish the data 
    await listener.onMessage(data, msg);

    // Ack the message 
    expect(msg.ack).toHaveBeenCalled();
});

it('it will throw error if while updating the version is not + 1', async() => {
    const {listener, data ,ticket, msg} = await setup();

    // Set the data version far way 
    data.version = 10;

    // Expection 
    try {
         await listener.onMessage(data, msg);
    } catch (err) {

    }
    expect(msg.ack).not.toHaveBeenCalled();
})