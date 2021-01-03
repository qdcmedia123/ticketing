import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

import {natsWrapper} from '../../nats-wrapper';
import { response } from 'express';

it('returns 404 if the provided id does not exists ', async() => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
     .put(`/api/tickets/${id}`)
     .set('Cookie', global.signin())
     .send({
         title: 'werwerwer',
         price: 20
     }).expect(404);
})

it('returns 401 if the user is not authenticated  ', async() => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
     .put(`/api/tickets/${id}`)
     .send({
         title: 'werwerwer',
         price: 20
     }).expect(401);
})

it('returns 401 if user does not own the ticket ', async() => {
    const response = await request(app)
     .post('/api/tickets')
     .set('Cookie', global.signin())
     .send({
         title: 'sdfsdfsdf',
         price: 345
     });

     await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', global.signin())
      .send({
          title: 'Hello World',
          price: 1000
      }).expect(401);
})

it('returns 400 if the user provides an invalid title or price ', async() => {
    const cookie = global.signin();
    const response = await request(app)
     .post('/api/tickets')
     .set('Cookie', cookie)
     .send({
         title: 'ask',
         price: 34
     });

     await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
          title: '',
          price: 345
      }).expect(400);

      await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
          title: '',
          price: -10
      }).expect(400);
})

it('updated the ticket provided valid inputs ', async() => {
    const cookie = global.signin();
    const response =  await request(app)
     .post(`/api/tickets`)
     .set('Cookie', cookie)
     .send({
         title: 'old title',
         price: 20
     })

     await request(app)
       .put(`/api/tickets/${response.body.id}`)
       .set('Cookie', cookie)
       .send({
           title: 'new title',
           price: 100
       });

    const ticketResponse = await request(app)
     .get(`/api/tickets/${response.body.id}`)
     .send();
     
     expect(ticketResponse.body.title).toEqual('new title');
     expect(ticketResponse.body.price).toEqual(100);

})

it('publishes an event', async() => {
  const response =   await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'sdfsfd',
      price : 10
    }).expect(201);
    
    await request(app)
       .put(`/api/tickets/${response.body.id}`)
       .set('Cookie', global.signin())
       .send({
           title: 'new title',
           price: 100
       });

     expect(natsWrapper.client.publish).toHaveBeenCalled();
  })