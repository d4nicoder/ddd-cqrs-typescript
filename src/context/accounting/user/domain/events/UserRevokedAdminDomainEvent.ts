import { DomainEvent } from "../../../../../shared/domain/DomainEvent";

export interface UserRevokedAdminDomainEventPayload {
	id: string;
}

/**
 * @name UserRevokedAdminDomainEvent
 * @description This event is triggered when a user is revoked from being an admin
 * @domain Accounting
 * @version 1
 * @type Event
 * @event admin.events.1.accounting.user.revoked_admin
 */
export class UserRevokedAdminDomainEvent extends DomainEvent<UserRevokedAdminDomainEventPayload> {
	static routingKey = "admin.events.1.accounting.user.revoked_admin";
	constructor(user: UserRevokedAdminDomainEventPayload) {
		super({
			routingKey: UserRevokedAdminDomainEvent.routingKey,
			id: user.id,
			payload: {
				id: user.id,
			},
		});
	}
}
