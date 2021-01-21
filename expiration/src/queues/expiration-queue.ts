import Queue from 'bull';
import {natsWrapper} from '../nats-wrapper';
import {ExpirationCompletePublisher} from '../events/publisher/expiration-complete-publisher';

interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async(job) => {
    // Let publish the event 
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    })
    console.log(`I would like to process the expireation time for order ${job.data.orderId}`)
});

export {expirationQueue};