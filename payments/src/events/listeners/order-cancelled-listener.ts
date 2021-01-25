import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  OrderStatus,
} from "@wealthface/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // Update the order
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    // Check if order found
    if (!order) {
      throw new Error("Order not found");
    }
    // update the order
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    // Ack the message
    msg.ack();
  }
}
