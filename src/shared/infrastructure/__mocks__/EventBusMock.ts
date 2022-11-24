import { DomainEvent } from "../../domain/DomainEvent";
import { DomainEventPayload } from "../../domain/EventBusBroker";
import { EventBus } from "../EventBus";
import { InMemoryEventBusBroker } from "../InMemoryEventBusBroker";

export class EventBusMock extends EventBus {
	private spyPublish = jest.fn();
	private spyPublishMany = jest.fn();
	private spySubscribe = jest.fn();
	private spyUnsubscribe = jest.fn();

	constructor() {
		super(new InMemoryEventBusBroker());
	}

	assertPublishCalledTimes(times: number): void {
		expect(this.spyPublish).toBeCalledTimes(times);
	}

	assertPublishCalledWith(event: DomainEvent<any>): void {
		expect(this.spyPublish).toBeCalledWith(event);
	}

	publish(event: DomainEvent<any>): void {
		this.spyPublish(event);
	}

	assertPublishManyCalledTimes(times: number): void {
		expect(this.spyPublishMany).toBeCalledTimes(times);
	}

	assertPublishManyCalledWith(events: DomainEvent<any>[]): void {
		expect(this.spyPublishMany).toBeCalledWith(events);
	}

	publishMany(events: DomainEvent<any>[]): void {
		this.spyPublishMany(events);
	}

	assertSubscribeCalledTimes(times: number): void {
		expect(this.spySubscribe).toBeCalledTimes(times);
	}

	assertSubscribeCalledWith(
		event: string,
		queue: string,
		callback: (event: DomainEventPayload) => Promise<void>,
	): void {
		expect(this.spySubscribe).toBeCalledWith(event, queue, callback);
	}

	async subscribe(event: string, queue: string, callback: (event: DomainEventPayload) => Promise<void>): Promise<void> {
		this.spySubscribe(event, queue, callback);
	}

	assertUnsubscribeCalledTimes(times: number): void {
		expect(this.spyUnsubscribe).toBeCalledTimes(times);
	}

	assertUnsubscribeCalledWith(queue: string, routingKey: string): void {
		expect(this.spyUnsubscribe).toBeCalledWith(queue, routingKey);
	}

	async unsubscribe(queue: string, routingKey: string): Promise<void> {
		this.spyUnsubscribe(queue, routingKey);
	}
}
