import { Nullable } from "../types/utility";
import { DomainEvent } from "./DomainEvent";

export interface DomainEventPayload {
	id: string;
	headers: Record<string, string>;
	replyTo: string;
	correlationId: Nullable<string>;
	expiration: Nullable<Date>;
	occurredAt: Date;
	routingKey: string;
	queue: string;
	content: unknown;
}
export abstract class EventBusBroker {
	abstract publish(event: DomainEvent<any>): Promise<void>;
	abstract subscribe(
		event: string,
		queue: string,
		callback: (event: DomainEventPayload) => Promise<void>,
	): Promise<void>;
	abstract unsubscribe(queue: string, routingKey: string): Promise<void>;
}
