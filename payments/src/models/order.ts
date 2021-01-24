import mongoose, { mongo } from "mongoose";
import { OrderStatus } from "@wealthface/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


interface OrderAtters {
  id: string;
  userId: string;
  version: number;
  status: OrderStatus;
  price: number;
}

interface OrderDoc extends mongoose.Document {

  userId: string;
  version: number;
  status: OrderStatus;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAtters): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
        type: String,
        required:true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.statics.build = (attrs:OrderAtters) => {
    return new Order({
        _id: attrs.id,
        version:attrs.version,
        price:attrs.price,
        userId: attrs.userId,
        status: attrs.status
    });
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
export {Order};