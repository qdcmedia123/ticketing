import express, { Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from "@wealthface/common";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    // find by id order and he populate ticket model
    const order = await Order.findById(req.params.orderId).populate("ticket");
    // If order not found then throw 404 notfound error
    if (!order) {
      throw new NotFoundError();
    }
    // check if order.orderId is not equal to current user id
    // Throw error notAuthorized error
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Send the order
    res.send(order);
  }
);

export { router as showOrderRouter };
