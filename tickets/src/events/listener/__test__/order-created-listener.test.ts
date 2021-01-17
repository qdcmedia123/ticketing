import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent, OrderStatus } from "@wealthface/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
const setup = async() => {
  // Create listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 45,
    userId: "abc",
  });

  // Save ticket
  await ticket.save();

  // Create the fake data endpoints for orderCreatedEvent
  const data: OrderCreatedEvent["data"] = {
    version: 0,
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: "abc",
    expiresAt: "string",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // Ack the message the received
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

it('sets the userid of the ticket', async() => {
    const {listener, data, ticket, msg} = await setup();
    // Create event with msg and data 
    await listener.onMessage(data , msg);
    // Find th ticket 
    const updatedTicket = await Ticket.findById(ticket.id);
    // Expect findTicket.orderId = data.id
    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async() => {
  const {listener, ticket, data, msg} = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});