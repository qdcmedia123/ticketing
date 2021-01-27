import {Subjects, Publisher, PaymentCreatedEvent} from '@wealthface/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}