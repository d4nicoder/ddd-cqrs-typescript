import {ContainerBuilder} from "diod";
import {UserAuthByPasswordService} from "./application/UserAuthByPasswordService";
import {UserDeactivateService} from "./application/UserDeactivateService";
import {UserRepository} from "./domain/UserRepository";
import {UserDeactivateController} from "./infrastructure/controllers/UserDeactivateController";
import {UserLoginController} from "./infrastructure/controllers/UserLoginController";
import {MongoUserRepository} from "./infrastructure/repositories/MongoUserRepository";
import {UserCreateService} from "./application/UserCreateService";
import {UserCreateController} from "./infrastructure/controllers/UserCreateController";

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
