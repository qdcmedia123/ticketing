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
    // Make sure that thiket is not already reserved
    // Order status is not *not* cancelled
    // If we find an order from that means the ticket is reserved
    const existingOrder = await Order.findOne({
      ticket: ticket,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ],
      },
    });

    if(existingOrder) {
        throw new BadRequestError('Ticket is already reserved.');
    }

    // Build the order and save it to the  database
    // Publish en event saying that an order was created
    res.send({});
  }
);

export { router as newOrderRouter };
