import { DomainEvent, DomainEventProps } from "./DomainEvent";
import { IdValueObject } from "./IdValueObject";

export abstract class AggregateRoot<T extends { id: string }> {
	public readonly id: IdValueObject;
	private events: DomainEvent<any>[] = [];

	protected constructor(id: string) {
		this.id = new IdValueObject(id);
	}

	/**
	 * Register a new event
	 * @param {DomainEvent<any>} event
	 */
	registerEvent(event: DomainEvent<any>) {
		this.events.push(event);
	}

	/**
	 * Return all registered events and clear the events array
	 * @returns {DomainEvent<any>[]}
	 */
	pullEvents(): DomainEvent<any>[] {
		return this.events.splice(0);
	}

	abstract toPrimitives(): T;
}
