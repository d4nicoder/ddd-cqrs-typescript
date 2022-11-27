import {container} from "../shared/container/container";
import {EventBus} from "../shared/infrastructure/EventBus";
import {eventHandlers} from "./eventHandlers";

export async function subscribeToEvents(): Promise<void> {
	const eventBus = container.get(EventBus);

	for (let i = 0; i < eventHandlers.length; i++) {
		const handler = container.get(eventHandlers[i]);
		await eventBus.subscribe(handler.routingKey, handler.queue, async (event) => {
			return handler.handle(event)
		});
		console.log(`✓ Subscribed to event ${handler.routingKey} on queue ${handler.queue}`);
	}
}
