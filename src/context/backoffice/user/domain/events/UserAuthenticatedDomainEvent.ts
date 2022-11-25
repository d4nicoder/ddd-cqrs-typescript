import { DomainEvent } from "../../../../../shared/domain/DomainEvent";
import { UserActivatedDomainEvent } from './UserActivatedDomainEvent'

export interface UserAuthenticatedDomainEventPayload {
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
export class UserAuthenticatedDomainEvent extends DomainEvent<UserAuthenticatedDomainEventPayload> {
	static routingKey = "admin.events.1.accounting.user.authenticated";
	constructor(user: UserAuthenticatedDomainEventPayload) {
		super({
			routingKey: UserActivatedDomainEvent.routingKey,
			id: user.id,
			payload: {
				id: user.id,
			},
		});
	}
}
