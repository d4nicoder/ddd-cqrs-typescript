import amqplib from "amqplib";
import {registerDependency} from "../container/registerDependency";
import {DomainEvent} from "../domain/DomainEvent";
import {DomainEventPayload, EventBusBroker} from "../domain/EventBusBroker";
import {config} from "../utils/config";

interface RabbitSubscriber {
	queue: string;
	routingKey: string;
	callback: (event: DomainEventPayload) => Promise<void>;
}

@registerDependency()
export class RabbitEventBusBroker extends EventBusBroker {
	private _connection?: amqplib.Connection;
	private _channel?: amqplib.Channel;
	private _exchangeName = config.get("rabbit.exchangeName");
	private _subscribers: Map<string, RabbitSubscriber> = new Map();
	private _publishQueue: Map<string, DomainEvent<any>> = new Map();
	private _connectionStatus: "connecting" | "connected" | "disconnected" = "disconnected";

	constructor() {
		super();
		this.getConnection().catch((e: any) => {
			console.error(e.message);
		});
	}

	private handleReconnect(): void {
		console.log("Trying to reconnect...");
		this._connectionStatus = "disconnected";
		this._connection = undefined;
		this._channel = undefined;

		setTimeout(() => {
			this.getConnection().catch((e: any) => {
				console.error(e.message);
			});
		}, 5000);
	}

	private async getConnection(): Promise<amqplib.Connection> {
		if (this._connection) {
			return this._connection;
		}
		if (this._connectionStatus !== "disconnected") {
			throw new Error("Connection is not ready");
		}
		console.log("Connecting to RabbitMQ...");
		this._connectionStatus = "connecting";
		const RABBIT_URL = config.get("rabbit.uri");

		try {
			this._connection = await amqplib.connect(RABBIT_URL);
		} catch (e) {
			this.handleReconnect();
			throw e;
		}

		this._connection.on("close", () => {
			this.handleReconnect();
		});

		// Resubscribe
		for (const [_, subscriber] of this._subscribers.entries()) {
			await this._subscribe(subscriber.queue, subscriber.routingKey, subscriber.callback);
		}

		// Publish pending events
		for (const [_, event] of this._publishQueue.entries()) {
			await this._publish(event);
		}

		this._connectionStatus = "connected";
		console.log("Connected to RabbitMQ");
		return this._connection;
	}

	private async getChannel(): Promise<amqplib.Channel> {
		if (this._channel) {
			return this._channel;
		}
		const connection = await this.getConnection();
		this._channel = await connection.createConfirmChannel();
		await this._channel.assertExchange(this._exchangeName, "topic", { durable: true, autoDelete: false });
		return this._channel;
	}

	private async _subscribe(
		queue: string,
		routingKey: string,
		callback: (event: DomainEventPayload) => Promise<void>,
	): Promise<void> {
		const channel = await this.getChannel();
		await channel.assertQueue(queue);
		await channel.bindQueue(queue, this._exchangeName, routingKey);
		await channel.consume(
			queue,
			(msg) => {
				if (msg) {
					const content = JSON.parse(msg.content.toString());
					const data: DomainEventPayload = {
						content: content,
						queue,
						routingKey,
						correlationId: msg.properties.correlationId,
						id: msg.properties.messageId,
						expiration: msg.properties.expiration,
						headers: msg.properties.headers,
						occurredAt: new Date(msg.properties.timestamp),
						replyTo: msg.properties.replyTo,
					}
					callback(data)
						.then(() => {
							channel.ack(msg)
						})
						.catch((e) => {
							// TODO: handle error
							console.error(e)
						});
				}
			},
			{
				noAck: false,
			},
		);
	}

	private async _publish(event: DomainEvent<any>): Promise<void> {
		const channel = await this.getChannel();
		channel.publish(this._exchangeName, event.routingKey.value, Buffer.from(JSON.stringify(event.toPrimitives())), {
			messageId: event.id.value,
			timestamp: event.occurredAt.value.getTime(),
		});
		this._publishQueue.delete(event.id.value);
	}

	async publish(event: DomainEvent<any>): Promise<void> {
		this._publishQueue.set(event.id.value, event);
		return this._publish(event);
	}

	async subscribe(event: string, queue: string, callback: (event: DomainEventPayload) => Promise<void>): Promise<void> {
		this._subscribers.set(event, { queue, routingKey: event, callback });
		try {
			await this._subscribe(queue, event, callback);
		} catch (e: any) {
			console.error(e.message);
		}
	}

	async unsubscribe(queue: string, routingKey: string): Promise<void> {
		try {
			const channel = await this.getChannel();
			await channel.unbindQueue(queue, this._exchangeName, routingKey);
		} catch (e: any) {
			console.error(e.message);
		}
	}
}
