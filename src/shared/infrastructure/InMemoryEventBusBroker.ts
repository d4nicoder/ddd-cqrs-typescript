import EventEmitter from "events";
import { DomainEvent } from "../domain/DomainEvent";
import { DomainEventPayload, EventBusBroker } from "../domain/EventBusBroker";

interface Subscriber {
	queue: string;
	routingKey: string;
	callback: (event: DomainEventPayload) => Promise<void>;
}

export class InMemoryEventBusBroker extends EventBusBroker {
	private _emitter: EventEmitter = new EventEmitter();
	private _listeners: Map<string, (event: DomainEvent<any>) => Promise<void>> = new Map();

	async publish(event: DomainEvent<any>): Promise<void> {
		this._emitter.emit(event.routingKey.value, event);
	}

	async subscribe(event: string, queue: string, callback: (event: DomainEventPayload) => Promise<void>): Promise<void> {
		const listener = async (ev: DomainEvent<any>): Promise<void> => {
			const message: DomainEventPayload = {
				content: ev.payload,
				correlationId: ev.id.value,
				expiration: null,
				headers: {},
				id: ev.id.value,
				occurredAt: ev.occurredAt.value,
				queue: queue,
				replyTo: "",
				routingKey: ev.routingKey.value,
			};
			// TODO: Handle errors
			callback(message).catch(console.error);
		};
		this._emitter.on(event, listener);
		this._listeners.set(`${event}-${queue}`, listener);
	}

	async unsubscribe(queue: string, routingKey: string): Promise<void> {
		const key = `${routingKey}-${queue}`;
		const listener = this._listeners.get(key);
		if (listener) {
			this._emitter.removeListener(key, listener);
			this._listeners.delete(key);
		}
	}
}
