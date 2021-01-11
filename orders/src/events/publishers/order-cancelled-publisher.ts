import {Publisher, OrderCancelledEvent, Subjects} from '@wealthface/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}