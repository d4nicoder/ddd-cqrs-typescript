import { eventHandlers } from "../../server/eventHandlers";
import { EventHandler } from "../domain/EventHandler";
import { Newable } from "./Dependency";

export const registerEventHandler = () => {
	return (target: Newable<EventHandler>): Newable<any> => {
		eventHandlers.push(target);
		return target;
	};
};
