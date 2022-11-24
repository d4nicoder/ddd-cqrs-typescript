import { DomainEvent } from "../../../../../shared/domain/DomainEvent";
import { UserDefinition } from "../User";

export interface UserChangedPersonalDataDomainEventPayload {
	id: string;
	firstName: string;
	lastName: string;
	fullName: string;
	birthDate: Date;
}

/**
 * @name UserChangedPersonalDataDomainEvent
 * @description This event is triggered when a user changes its personal data
 * @domain Accounting
 * @version 1
 * @type Event
 * @event admin.events.1.accounting.user.changed_personal_data
 */
export class UserChangedPersonalDataDomainEvent extends DomainEvent<UserChangedPersonalDataDomainEventPayload> {
	static routingKey = "admin.events.1.accounting.user.changed_personal_data";
	constructor(user: UserChangedPersonalDataDomainEventPayload) {
		super({
			routingKey: UserChangedPersonalDataDomainEvent.routingKey,
			id: user.id,
			payload: {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				fullName: user.fullName,
				birthDate: user.birthDate,
			},
		});
	}
}
