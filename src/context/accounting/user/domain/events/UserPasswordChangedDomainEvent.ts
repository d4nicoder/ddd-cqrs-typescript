import { DomainEvent } from "../../../../../shared/domain/DomainEvent";

export interface UserPasswordChangedDomainEventPayload {
	id: string;
}

/**
 * @name UserPasswordChangedDomainEvent
 * @description This event is triggered when a user changes its password
 * @domain Accounting
 * @version 1
 * @type Event
 * @event admin.events.1.accounting.user.changed_password
 */
export class UserPasswordChangedDomainEvent extends DomainEvent<UserPasswordChangedDomainEventPayload> {
	static routingKey = "admin.events.1.accounting.user.password_changed";
	constructor(user: UserPasswordChangedDomainEventPayload) {
		super({
			routingKey: UserPasswordChangedDomainEvent.routingKey,
			id: user.id,
			payload: {
				id: user.id,
			},
		});
	}
}
