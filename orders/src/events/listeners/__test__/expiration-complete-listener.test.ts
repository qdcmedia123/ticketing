import { ExpirationCompleteEvent, OrderStatus } from "@wealthface/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";
import { ExpirationCompleteListener } from "../../listeners/expiration-complete-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // Create listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // Create the ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 3432,
  });

  // Save the ticket
  await ticket.save();

  // Create the order
  const order = Order.build({
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });

  // Save the order
  await order.save();

  // Publish the event Expiration complete evetnt
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // Ack the message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // Return the data
  return { listener, ticket, order, msg, data };
};

it("update the order to cancelled", async () => {
  // Distruct the data from setup
  const { listener, data, msg, ticket, order } = await setup();

  // Publsh the message
  await listener.onMessage(data, msg);
  // Find the order by order id
  const UpdateOrder = await Order.findById(order.id);

  // Expect
  expect(UpdateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit on order cancel event", async () => {
  // Distruct the data from setup
  const { listener, data, msg, ticket, order } = await setup();
  // Publsh the message
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
    const { listener, data, msg, ticket, order } = await setup();
    // Publsh the message
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});
