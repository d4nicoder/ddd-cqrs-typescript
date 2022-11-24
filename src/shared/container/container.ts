import "reflect-metadata";
import diod from "diod";
import { EventBusBroker } from "../domain/EventBusBroker";
import { InMemoryEventBusBroker } from "../infrastructure/InMemoryEventBusBroker";
import { EventBus } from "../infrastructure/EventBus";
import { MongoDatabaseConnection } from "../domain/MongoDatabaseConnection";
import { MongoWriteConnection } from "../infrastructure/MongoWriteConnection";
import { config } from "../utils/config";
import { registerAccountingDependencies } from "../../context/accounting/accountingDependencies";

const builder = new diod.ContainerBuilder();

// Register core dependencies
builder.register(EventBusBroker).use(InMemoryEventBusBroker);
builder.registerAndUse(EventBus).asSingleton();
builder
	.register(MongoDatabaseConnection)
	.useFactory(() => {
		return new MongoWriteConnection(config.get("mongo.write.uri"), config.get("mongo.write.database"));
	})
	.asSingleton();

// Register accounting dependencies
registerAccountingDependencies(builder);

export const container = builder.build({ autowire: true });
