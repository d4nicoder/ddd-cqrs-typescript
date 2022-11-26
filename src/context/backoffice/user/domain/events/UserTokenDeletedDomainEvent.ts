import { DomainEvent } from "../../../../../shared/domain/DomainEvent";

export interface UserTokenDeletedEventPayload {
	id: string;
	tokenId: string;
}

/**
 * @name UserActivatedDomainEvent
 * @description This event is triggered when a user is activated
 * @domain Accounting
 * @version 1
 * @type Event
 * @event admin.events.1.accounting.user.activated
 */
export class UserTokenDeletedEvent extends DomainEvent<UserTokenDeletedEventPayload> {
	static routingKey = "admin.events.1.accounting.user.token_deleted";
	constructor(user: UserTokenDeletedEventPayload) {
		super({
			routingKey: UserTokenDeletedEvent.routingKey,
			id: user.id,
			payload: {
				id: user.id,
				tokenId: user.tokenId,
			},
		});
	}
}
