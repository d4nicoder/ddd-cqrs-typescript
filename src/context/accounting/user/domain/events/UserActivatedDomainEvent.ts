import { DomainEvent } from "../../../../../shared/domain/DomainEvent";

export interface UserActivatedDomainEventPayload {
	id: string;
}

/**
 * @name UserActivatedDomainEvent
 * @description This event is triggered when a user is activated
 * @domain Accounting
 * @version 1
 * @type Event
 * @event admin.events.1.accounting.user.activated
 */
export class UserActivatedDomainEvent extends DomainEvent<UserActivatedDomainEventPayload> {
	static routingKey = "admin.events.1.accounting.user.activated";
	constructor(user: UserActivatedDomainEventPayload) {
		super({
			routingKey: UserActivatedDomainEvent.routingKey,
			id: user.id,
			payload: {
				id: user.id,
			},
		});
	}
}
