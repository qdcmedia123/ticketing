import {Listener, PaymentCreatedEvent, Subjects, NotFoundError} from '@wealthface/common';
import {queueGroupName} from './queue-group-name';
import {Message} from 'node-nats-streaming';
import {stripe} from '../../stripe';
import {transport} from '../../nodemailer';
import nodemailer from 'nodemailer';
import {OrderConfirmedTemplate} from '../../templates/OrderConfirmation';
import {OrderConfirmationEmailPublisher} from '../../events/publishers/order-confirmation-email-publisher';
import {natsWrapper} from '../../nats-wrapper';

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
        const {billing_details: {email, name}, amount, id:orderID} = charge;
       
        console.log(charge);
        // Fetch the email of the client and how much he paid 
        // What he paid for 
        // Create simple html template 
        // Send the emai use nodemailer 
        // publish the event that em
        // send mail with defined transport object
            let info = await transport.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: name!, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: OrderConfirmedTemplate({name, orderID, amount, email}), // html body
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
          
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            // Let publish the event now that email sent to the client 
            try {
                await new OrderConfirmationEmailPublisher(natsWrapper.client).publish({
                    orderId: orderId
                });
            } catch(err) {
                console.log(err)
            }

        msg.ack();
    }
}