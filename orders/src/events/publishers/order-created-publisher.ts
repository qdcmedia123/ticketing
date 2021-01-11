import {Publisher, OrderCreatedEvent, Subjects} from '@wealthface/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    
}