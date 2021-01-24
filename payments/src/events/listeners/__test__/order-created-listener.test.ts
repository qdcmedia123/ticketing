import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, Subjects, OrderStatus } from "@wealthface/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Order } from "../../../models/order";
import mongoose from "mongoose";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    expiresAt: "sfsdfsdf",
    userId: "sdfsdf",
    version: 0,
    status: OrderStatus.Created,
    ticket: {
      id: "werse",
      price: 34,
    },
  };

  // @ts-ignore
  const msg:Message = {
      ack: jest.fn()
  }

  return {listener, data, msg};
};

it('replicate the order info', async() => {
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    const order = await Order.findById(data.id);
    expect(order!.price).toEqual(data.ticket.price);
});

// it('ack the message', async() => {
//     const {listener, data, msg} = await setup();
//     await listener.onMessage(data, msg);
//     expect(msg.ack).toHaveBeenCalled();
// });
