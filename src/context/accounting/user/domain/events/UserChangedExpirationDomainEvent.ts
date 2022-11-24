import { DomainEvent } from "../../../../../shared/domain/DomainEvent";
import { Nullable } from "../../../../../shared/types/utility";
import { UserDefinition } from "../User";

export interface UserChangedExpirationDomainEventPayload {
	id: string;
	expiresAt: Nullable<Date>;
}

/**
 * @name UserChangedExpirationDomainEvent
 * @description This event is triggered when a user changes its expiration date
 * @domain Accounting
 * @version 1
 * @type Event
 * @event admin.events.1.accounting.user.changed_expiration
 */
export class UserChangedExpirationDomainEvent extends DomainEvent<UserChangedExpirationDomainEventPayload> {
	static routingKey = "admin.events.1.accounting.user.changed_expiration";
	constructor(user: UserChangedExpirationDomainEventPayload) {
		super({
			routingKey: UserChangedExpirationDomainEvent.routingKey,
			id: user.id,
			payload: {
				id: user.id,
				expiresAt: user.expiresAt,
			},
		});
	}
}
