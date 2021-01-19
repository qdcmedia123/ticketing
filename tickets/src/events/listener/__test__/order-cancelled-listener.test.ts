import {OrderCancelledListener} from '../order-cancelled-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {Ticket} from '../../../models/ticket';
import mongoose from 'mongoose';
import {OrderCancelledEvent} from '@wealthface/common';
import { Message } from 'node-nats-streaming';

const setup = async() => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const orderId = mongoose.Types.ObjectId().toHexString();
    // Build ticket 
    const ticket = Ticket.build({
        title:'concert',
        price:34,
        userId:'sdf',
    });

    // Set order id 
    ticket.set({orderId: orderId});
    await ticket.save();
    // Create the event 
    const data: OrderCancelledEvent['data'] = {
        version:0,
        id: orderId,
        ticket: {
            id: ticket.id
        }
    };

    // Create the mesage 
    // @ts-ignore
    const msg:Message = {
        ack: jest.fn()
    };

    // Publish the message 
    await listener.onMessage(data, msg);

    return {listener, data, ticket, msg, orderId};
}

it('updated the ticket published an event , and acks the message', async() => {
   const {listener, msg, data, ticket} = await setup();
   // Publish the event 
   await listener.onMessage(data, msg);
   // Update ticket with order id undefined as 
   const updatedTicket = await Ticket.findById(ticket.id);
   // Expected updatedticket.orderId undefined
   expect(updatedTicket!.orderId).not.toBeDefined();
   expect(msg.ack).toHaveBeenCalled();

});