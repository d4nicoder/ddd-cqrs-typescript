import { DomainEvent } from "../domain/DomainEvent";
import { DomainEventPayload, EventBusBroker } from "../domain/EventBusBroker";
import { registerDependency } from "../container/registerDependency";

@registerDependency()
export class EventBus {
	constructor(private _broker: EventBusBroker) {}

	publish(event: DomainEvent<any>): void {
		this._broker.publish(event).catch((e) => {
			console.error(e);
		});
	}

	publishMany(events: DomainEvent<any>[]): void {
		events.forEach((e) => {
			this.publish(e);
		});
	}

	async subscribe(event: string, queue: string, callback: (event: DomainEventPayload) => Promise<void>): Promise<void> {
		await this._broker.subscribe(event, queue, callback);
	}

	async unsubscribe(queue: string, routingKey: string): Promise<void> {
		await this._broker.unsubscribe(queue, routingKey);
	}
}
