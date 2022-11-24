import { ContainerBuilder } from "diod";
import { registerUserDependencies } from "./user/userDependencies";

export const registerAccountingDependencies = (builder: ContainerBuilder) => {
	registerUserDependencies(builder);
};
