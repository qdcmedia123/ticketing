import {Subjects} from './subjects';

export interface OrderConfirmedEmailEvent {
    subject: Subjects.OrderConfirmedEmailCreated,
    data: {
        orderId: string
    }
}