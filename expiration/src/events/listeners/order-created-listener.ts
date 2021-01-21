import {Listener, OrderCreatedEvent, Subjects} from '@wealthface/common';
import {queueGroupName} from './queue-group-name';
import {Message} from 'node-nats-streaming';
import {expirationQueue} from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg:Message) {
        // - expireAt - new Date() // get the different in millisecound 
        const expAt = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log(`Queue jobs will process after ${expAt} millisecound.`)
        await expirationQueue.add({
            orderId:data.id
        }, {
            delay:expAt
        });

        msg.ack();
    }
}