import express, { Request, Response } from "express";
import {
  requireAuth,
  NotAuthorizedError,
  NotFoundError,
} from "@wealthface/common";
import { Order, OrderStatus } from "../models/order";
import {OrderCancelledPublisher} from '../events/publishers/order-cancelled-publisher';
import {natsWrapper} from '../nats-wrapper';

const router = express.Router();


router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    // Find the order exists by order id
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('ticket');

    // If no order find then NotFounderror thorw
    if (!order) {
      throw new NotFoundError();
    }

    //If User id is not equstion to the order.userId
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // update the records status to cancelled
    order.status = OrderStatus.Cancelled;
    order.save();
    // throw not authorized error
    // Publish the event by saying this order has been cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
      version: order.version,
      id: order.id,
      ticket: {
        id: order.ticket.id
      }

    })
    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
