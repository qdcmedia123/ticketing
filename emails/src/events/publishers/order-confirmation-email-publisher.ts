import {Publisher, OrderConfirmedEmailEvent, Subjects} from '@wealthface/common';

export class OrderConfirmationEmailPublisher extends Publisher<OrderConfirmedEmailEvent> {
    subject: Subjects.OrderConfirmedEmailCreated=  Subjects.OrderConfirmedEmailCreated;
    
}