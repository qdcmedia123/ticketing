import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from "@wealthface/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();
const EXPIRATION_WINDOW_SECOUND = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Fin the ticket the user is trying to order in the database
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    // Calculate an expiration date for this order
    if (!ticket) {
      
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved.");
    }

    // Calculate an expireation date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECOUND);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });
    // Publish en event saying  that an order was created
    await order.save();

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
