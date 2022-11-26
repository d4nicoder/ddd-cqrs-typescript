import { DomainEvent } from "../../../../../shared/domain/DomainEvent";
import { UserTokenDefinition } from "../UserToken";

export interface UserTokenCreatedEventPayload {
	id: string;
	token: UserTokenDefinition;
}

/**
 * @name UserActivatedDomainEvent
 * @description This event is triggered when a user is activated
 * @domain Accounting
 * @version 1
 * @type Event
 * @event admin.events.1.accounting.user.activated
 */
export class UserTokenCreatedEvent extends DomainEvent<UserTokenCreatedEventPayload> {
	static routingKey = "admin.events.1.accounting.user.token_created";
	constructor(user: UserTokenCreatedEventPayload) {
		super({
			routingKey: UserTokenCreatedEvent.routingKey,
			id: user.id,
			payload: {
				id: user.id,
				token: user.token,
			},
		});
	}
}
