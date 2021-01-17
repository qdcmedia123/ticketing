import request from 'supertest';
import {app} from '../../app';
import {Order} from '../../models/order';
import {Ticket} from '../../models/ticket';
import mongoose from 'mongoose';
const buildTicket = async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });

    await ticket.save();
    return ticket;
}

it('fetches orders for an particulers user', async() => {
    // First create 3 tickets using ticket model 
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();
    
    // Store two different users 
    const userOne = global.signin();
    const userTwo = global.signin();

    // Creat one order as user #1
    await request(app)
          .post('/api/orders')
          .set('Cookie', userOne)
          .send({ticketId: ticketOne.id})
          .expect(201);
    
    const {body: orderOne} = await request(app)
          .post('/api/orders')
          .set('Cookie', userTwo)
          .send({ticketId: ticketTwo.id});
    
    const {body: orderTwo} = await request(app)
          .post('/api/orders')
          .set('Cookie', userTwo)
          .send({ticketId: ticketThree.id});
    
    // Create two orers as user #2 
    const response = await request(app)
                    .get('/api/orders')
                    .set('Cookie', userTwo)
                    .expect(200);
    
    
    // Make request to get order for User #2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);
    // Make sure we only got the orders for User #2
})