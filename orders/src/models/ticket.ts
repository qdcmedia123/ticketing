import mongoose from 'mongoose';
import {Order, OrderStatus} from './order';


interface TicketAttrs {
    title: string;
    price: number;
}

// Create document 
export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    isReserved(): Promise<boolean>;
}

// Create model 
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

// Creat sheman 
const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }


}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

// Static build 
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

// Adding function isReserved 
ticketSchema.methods.isReserved = async function () {
    // Make sure that ticket is not already reserved
    // Order status is not *not* cancelled
    // If we find an order from that means the ticket is reserved
    
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
          $in: [
            OrderStatus.Created,
            OrderStatus.AwaitingPayment,
            OrderStatus.Complete,
          ],
        },
      });
    
      return !!existingOrder;
}
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);
export {Ticket};