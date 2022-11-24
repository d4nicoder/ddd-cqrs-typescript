import { ContainerBuilder } from "diod";
import { UserDeactivateService } from "./application/UserDeactivateService";
import { UserRepository } from "./domain/UserRepository";
import { MongoUserRepository } from "./infrastructure/repositories/MongoUserRepository";
import { UserCreateService } from "./application/UserCreateService";
import { UserCreateController } from "./infrastructure/controllers/UserCreateController";

export const registerUserDependencies = (builder: ContainerBuilder) => {
	builder.register(UserRepository).use(MongoUserRepository);

	// Services
	builder.registerAndUse(UserCreateService);
	builder.registerAndUse(UserDeactivateService);

	// Controllers
	builder.registerAndUse(UserCreateController);
};
