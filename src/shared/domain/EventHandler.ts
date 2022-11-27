import { DomainEventPayload } from "./EventBusBroker";

export abstract class EventHandler {
	public readonly routingKey: string;
	public readonly queue: string;

	protected constructor(routingKey: string, queue: string) {
		this.routingKey = routingKey;
		this.queue = queue;
	}

	abstract handle(event: DomainEventPayload): Promise<void>;
}
