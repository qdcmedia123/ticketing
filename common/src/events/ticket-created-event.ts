import { Subjects } from './subjects';

export interface TicketCreatedEvent {
    subject: Subjects.TicketCreated;
    data: {
        version: number,
        id: string;
        title: string;
        price: number;
        userId:string;
    }
}

// Just update