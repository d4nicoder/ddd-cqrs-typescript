import {container} from "../shared/container/container";
import {EventBus} from "../shared/infrastructure/EventBus";
import {eventHandlers} from "./eventHandlers";

export async function subscribeToEvents(): Promise<void> {
	const eventBus = container.get(EventBus);

	for (let i = 0; i < eventHandlers.length; i++) {
		const handler = new eventHandlers[i]();
		await eventBus.subscribe(handler.routingKey, handler.queue, handler.handle);
		console.log(`✓ Subscribed to event ${handler.routingKey} on queue ${handler.queue}`);
	}
}
