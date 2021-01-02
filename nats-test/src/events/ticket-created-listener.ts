import {Message, Stan} from 'node-nats-streaming'
import { Listener } from './base-listeners';
import {TicketCreatedEvent} from './ticket-created-event';
import {Subjects} from './subjects';


class TicketCreatedListener extends Listener<TicketCreatedEvent> {
   readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = "payment-service";
    

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
      console.log("Event data", data);
      msg.ack();
    }
  }

  export { TicketCreatedListener};