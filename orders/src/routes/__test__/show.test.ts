import request from "supertest";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { app } from "../../app";
import mongoose from 'mongoose';
it("fetches the order", async () => {
  // Create ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 4345,
  });
  // Save the ticket
  ticket.save();
  const user = global.signin();
  // make a request ot build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id });
  // make request to fetch the order by order id
  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(order.id).toEqual(fetchOrder.id);
});

it("returns false if un authorize user try to fetch order", async () => {
  // Create ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 4345,
  });
  // Save the ticket
  ticket.save();
  const user = global.signin();
  // make a request ot build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id });
  // make request to fetch the order by order id
  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .expect(401);
});
