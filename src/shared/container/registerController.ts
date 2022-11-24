import { controllers } from "../../server/controllers";
import { Newable } from "./Dependency";
import { Controller } from "../domain/Controller";

export const registerController = () => {
	return (target: Newable<Controller>): Newable<any> => {
		controllers.push(target);
		return target;
	};
};
