import request from 'supertest';
import {app} from '../../app';
import {Order} from '../../models/order';
import {Ticket} from '../../models/ticket';

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });

    await ticket.save();
    return ticket;
}

it('fetches orders for an particulers user', async() => {
    // First create 3 tickets using ticket model 
    // Creat one oder as user #1
    // Create two orers as user #2 
    // Make request to get order for User #2
    // Make sure we only got the orders for User #2
})