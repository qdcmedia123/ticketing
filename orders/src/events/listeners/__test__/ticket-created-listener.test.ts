import {TicketCreatedEvent} from '@wealthface/common';
import {TicketCreatedListener} from '../ticket-created-listener';
import {natsWrapper} from '../../../nats-wrapper';
import mongoose, { mongo } from 'mongoose';
import {Message} from 'node-nats-streaming';
import {Ticket} from '../../../models/ticket';
const setup = async() => {
    // create an instance of the listener 
    const listener = new TicketCreatedListener(natsWrapper.client);
    // create a fack data event 
    const data: TicketCreatedEvent['data'] = {
        version:0,
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 55,
        userId: mongoose.Types.ObjectId().toHexString()
    }
    // create a fake message object 
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg}
};

it('creates as saves a ticket', async() => {
    
    const {listener, data, msg} = await setup();
    // call the onMessage function with the data object + message object 
    await listener.onMessage(data, msg);
    // write assertation to make sure a ticket was created!
   const ticket = await Ticket.findById(data.id);
   
   // Title and id must exits 
   expect(ticket).toBeDefined();
   expect(ticket!.title).toEqual(data.title);
   expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async() => {

    // call the onMessage function with the data object + message object 
    const {listener, data, msg} = await setup();
    // Write assertition to make sure that ack method is called
    await listener.onMessage(data, msg);

    // msg.ack should be called 
    expect(msg.ack).toBeCalled();
});
