import { ContainerBuilder } from "diod";
import { UserAuthByPasswordService } from "./application/UserAuthByPasswordService";
import { UserCreateService } from "./application/UserCreateService";
import { UserDeactivateService } from "./application/UserDeactivateService";
import { UserRepository } from "./domain/UserRepository";
import { UserCreateController } from "./infrastructure/controllers/UserCreateController";
import { UserDeactivateController } from "./infrastructure/controllers/UserDeactivateController";
import { UserLoginController } from "./infrastructure/controllers/UserLoginController";
import { MongoUserRepository } from "./infrastructure/repositories/MongoUserRepository";

export const registerUserDependencies = (builder: ContainerBuilder) => {
	builder.register(UserRepository).use(MongoUserRepository);

	// Services
	builder.registerAndUse(UserCreateService);
	builder.registerAndUse(UserDeactivateService);
	builder.registerAndUse(UserAuthByPasswordService);

	// Controllers
	builder.registerAndUse(UserCreateController);
	builder.registerAndUse(UserLoginController);
	builder.registerAndUse(UserDeactivateController);
};
