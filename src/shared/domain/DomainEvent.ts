import { IdValueObject } from "./IdValueObject";
import { StringValueObject } from "./StringValueObject";
import { DateValueObject } from "./DateValueObject";

export interface DomainEventProps<T> {
	id: string;
	routingKey: string;
	payload: T;
}

export abstract class DomainEvent<T> {
	public readonly routingKey: StringValueObject;
	public readonly occurredAt: DateValueObject;
	public readonly id: IdValueObject;
	public readonly payload: T;

	constructor(props: DomainEventProps<T>) {
		this.routingKey = new StringValueObject(props.routingKey);
		this.occurredAt = new DateValueObject(new Date());
		this.id = new IdValueObject(props.id);
		this.payload = props.payload;
	}

	toPrimitives() {
		return {
			routingKey: this.routingKey.value,
			occurredAt: this.occurredAt.value,
			id: this.id.value,
			payload: this.payload,
		};
	}
}
