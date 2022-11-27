import { ContainerBuilder } from "diod";
import { clientDependencies } from "./client/clientDependencies";
import { registerUserDependencies } from "./user/userDependencies";

export const registerBackofficeDependencies = (builder: ContainerBuilder) => {
	registerUserDependencies(builder);
	clientDependencies(builder);
};
