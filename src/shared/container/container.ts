import "reflect-metadata";
import diod from "diod";
import { EventBusBroker } from "../domain/EventBusBroker";
import { InMemoryEventBusBroker } from "../infrastructure/InMemoryEventBusBroker";
import { EventBus } from "../infrastructure/EventBus";
import { MongoDatabaseConnection } from "../domain/MongoDatabaseConnection";
import { MongoWriteConnection } from "../infrastructure/MongoWriteConnection";
import { RabbitEventBusBroker } from "../infrastructure/RabbitEventBusBroker";
import { config } from "../utils/config";
import { registerBackofficeDependencies } from "../../context/backoffice/backofficeDependencies";

const builder = new diod.ContainerBuilder();

// Register core dependencies
if (config.get("rabbit.enabled")) {
	builder.register(EventBusBroker).use(RabbitEventBusBroker).asSingleton();
} else {
	builder.register(EventBusBroker).use(InMemoryEventBusBroker).asSingleton();
}

builder.registerAndUse(EventBus).asSingleton();
builder
	.register(MongoDatabaseConnection)
	.useFactory(() => {
		return new MongoWriteConnection(config.get("mongo.write.uri"), config.get("mongo.write.database"));
	})
	.asSingleton();

// Register accounting dependencies
registerBackofficeDependencies(builder);

export const container = builder.build({ autowire: true });
