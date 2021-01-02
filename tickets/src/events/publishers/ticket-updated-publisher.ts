import {Publisher, Subjects, TicketUpdatedEvent} from '@wealthface/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject:Subjects.TicketUpdated = Subjects.TicketUpdated;
}