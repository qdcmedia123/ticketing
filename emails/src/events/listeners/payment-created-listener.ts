import {Listener, PaymentCreatedEvent, Subjects, NotFoundError} from '@wealthface/common';
import {queueGroupName} from './queue-group-name';
import {Message} from 'node-nats-streaming';
import {stripe} from '../../stripe';

export class PaymentCreatedListener extends Listener <PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        // Distruct the data from the event 
        const {id, stripeId, orderId} = data;
        console.log(queueGroupName + 'received the event');
        // Send the request to stripe to get the client details 
        const charge = await stripe.charges.retrieve(stripeId);
        // Throw error is charge is not found 
        if(!charge) {
            throw new Error('Unable to find the charge');
        }
        const {billing_details: {email, name}} = charge;
        
        console.log(charge);
        // Fetch the email of the client and how much he paid 
        // What he paid for 
        // Create simple html template 
        // Send the emai use nodemailer 
        // publish the event that em
        msg.ack();
    }
}