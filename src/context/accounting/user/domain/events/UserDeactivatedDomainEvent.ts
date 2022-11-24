import { DomainEvent } from "../../../../../shared/domain/DomainEvent";

export interface UserDeactivatedDomainEventPayload {
	id: string;
}

/**
 * @name UserDeactivatedDomainEvent
 * @description This event is triggered when a user is deactivated
 * @domain Accounting
 * @version 1
 * @type Event
 * @event admin.events.1.accounting.user.deactivated
 */
export class UserDeactivatedDomainEvent extends DomainEvent<UserDeactivatedDomainEventPayload> {
	static routingKey = "admin.events.1.accounting.user.deactivated";
	constructor(user: UserDeactivatedDomainEventPayload) {
		super({
			routingKey: UserDeactivatedDomainEvent.routingKey,
			id: user.id,
			payload: {
				id: user.id,
			},
		});
	}
}
