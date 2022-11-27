import { registerEventHandler } from "../../../../../shared/container/registerEventHandler";
import { DomainEventPayload } from "../../../../../shared/domain/EventBusBroker";
import { EventHandler } from "../../../../../shared/domain/EventHandler";
import { Nullable } from "../../../../../shared/types/utility";
import { Client } from "../../domain/Client";
import { ClientRepository } from "../../domain/ClientRepository";

interface ClientCreatedEvent {
	id: string;
	name: string;
	lastName: string;
	birthDate: Date;
	email: string;
	password: string;
	salt: string;
	timezone: string;
	language: string;
	createdAt: Date;
	isEnabled: boolean;
	emailVerified: boolean;
	passwordRestoreToken: Nullable<string>;
}

@registerEventHandler()
export class ClientCreateOnCreatedFromSaaS extends EventHandler {
	constructor(private clientRepository: ClientRepository) {
		// TODO: We should move these magic strings to a config file
		super("saas.events.1.user.created", "create_client_on_saas_created");
	}

	async handle(event: DomainEventPayload): Promise<void> {
		const payload = event.content as ClientCreatedEvent;
		const client = new Client({
			birthDate: payload.birthDate,
			createdAt: payload.createdAt,
			email: payload.email,
			firstName: payload.name,
			id: payload.id,
			isEnabled: payload.isEnabled,
			isVerified: payload.emailVerified,
			language: payload.language,
			lastName: payload.lastName,
			timezone: payload.timezone,
		});
		await this.clientRepository.save(client);
	}
}
