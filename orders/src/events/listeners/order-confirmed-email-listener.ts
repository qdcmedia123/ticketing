import {
  Listener,
  OrderConfirmedEmailEvent,
  Subjects,
} from "@wealthface/common";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";

export class OrderConfirmedEmailListener extends Listener<OrderConfirmedEmailEvent> {
  subject: Subjects.OrderConfirmedEmailCreated =
    Subjects.OrderConfirmedEmailCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderConfirmedEmailEvent["data"], msg: Message) {
    const { orderId } = data;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error(`Order was unable to find with id ${orderId}`);
    }
    order.set({ confirmedEmail: "true" });
    await order.save();
    msg.ack();
  }
}
