import { ContainerBuilder } from "diod";
import { registerUserDependencies } from "./user/userDependencies";

export const registerBackofficeDependencies = (builder: ContainerBuilder) => {
	registerUserDependencies(builder);
};
