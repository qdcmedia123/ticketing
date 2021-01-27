import { Order } from "../../models/order";
import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { OrderStatus } from "@wealthface/common";
import {stripe} from '../../stripe';
//jest.mock('../../stripe');
import {Payment} from '../../models/payment';

it("it returns 404 when request order does not exits", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "sdfsdf",
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("it return 401 when purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 34,
  });

  await order.save();

  // Now try to make the payment
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "sdfsdf",
      orderId: order.id,
    })
    .expect(401);
});

it("return a 400 when purchasing a cancelled order", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId,
    status: OrderStatus.Cancelled,
    price: 34,
  });

  await order.save();

  // Lets cancel the order
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "sdfsdf",
      orderId: order.id,
    })
    .expect(400);
});

it('returns a 201 with valid input', async() => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 10000);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: userId,
    status: OrderStatus.Created,
    price
  });

  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

    // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    // expect(chargeOptions.source).toEqual('tok_visa');
    // expect(chargeOptions.amount).toEqual(34 * 100);
    // expect(chargeOptions.currency).toEqual('usd');
    const stripeCharges = await stripe.charges.list({limit: 50});
    const stipeCharge = stripeCharges.data.find(charge => {
      return charge.amount === price * 100
    });


    expect(stipeCharge).toBeDefined();
    expect(stipeCharge!.currency).toEqual('usd');

    const payment = Payment.findOne({
      orderId:order.id,
      stripeId: stipeCharge!.id
    });
    expect(payment).not.toBeNull();

})
