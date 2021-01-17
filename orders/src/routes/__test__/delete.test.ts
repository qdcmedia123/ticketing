import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import {natsWrapper} from '../../nats-wrapper';
import mongoose from 'mongoose';

it("marks an order as cancelled", async () => {
  // Create ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 34,
  });

  await ticket.save();
  const user = global.signin();
  // make a request ot create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(204);

  // Fetch the order to make sure order is canceled by its id
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emirs a order cancelled", async() => {
// Create ticket
const ticket = Ticket.build({
  id: mongoose.Types.ObjectId().toHexString(),
  title: "concert",
  price: 34,
});

await ticket.save();
const user = global.signin();
// make a request ot create an order
const { body: order } = await request(app)
  .post("/api/orders")
  .set("Cookie", user)
  .send({ ticketId: ticket.id })
  .expect(201);

// Make request to cancel the order
await request(app)
  .delete(`/api/orders/${order.id}`)
  .set("Cookie", user)
  .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  
});
