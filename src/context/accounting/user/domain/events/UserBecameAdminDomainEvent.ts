import { DomainEvent } from "../../../../../shared/domain/DomainEvent";

export interface UserBecameAdminDomainEventPayload {
	id: string;
}

/**
 * @name UserBecameAdminDomainEvent
 * @description This event is triggered when a user becomes an admin
 * @domain Accounting
 * @version 1
 * @type Event
 * @event admin.events.1.accounting.user.became_admin
 */
export class UserBecameAdminDomainEvent extends DomainEvent<UserBecameAdminDomainEventPayload> {
	static routingKey = "admin.events.1.accounting.user.became_admin";
	constructor(user: UserBecameAdminDomainEventPayload) {
		super({
			routingKey: UserBecameAdminDomainEvent.routingKey,
			id: user.id,
			payload: {
				id: user.id,
			},
		});
	}
}
