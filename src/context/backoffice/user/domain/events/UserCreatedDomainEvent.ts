import { DomainEvent } from "../../../../../shared/domain/DomainEvent";
import { UserDefinition } from "../User";

/**
 * @name UserCreatedDomainEvent
 * @description This event is triggered when a user is created
 * @domain Accounting
 * @version 1
 * @type Event
 * @event admin.events.1.accounting.user.created
 */
export class UserCreatedDomainEvent extends DomainEvent<UserDefinition> {
	static routingKey = "admin.events.1.accounting.user.created";
	constructor(user: UserDefinition) {
		super({
			routingKey: UserCreatedDomainEvent.routingKey,
			id: user.id,
			payload: user,
		});
	}
}
