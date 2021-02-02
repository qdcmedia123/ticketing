import {Subjects} from './subjects';

export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data: {
        version: number,
        id: string;
        ticket: {
            id: string;
        }
    }
}