import { ContainerBuilder } from "diod";
import { ClientCreateOnCreatedFromSaaS } from "./application/eventHandlers/ClientCreateOnCreatedFromSaaS";
import { ClientRepository } from "./domain/ClientRepository";
import { MongoClientRepository } from "./infrastructure/MongoClientRepository";

export const clientDependencies = (builder: ContainerBuilder) => {
	// Repositories
	builder.register(ClientRepository).use(MongoClientRepository);

	// Event handlers
	builder.registerAndUse(ClientCreateOnCreatedFromSaaS);
};
