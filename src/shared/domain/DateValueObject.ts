import { ValueObject } from "./ValueObject";

export class DateValueObject extends ValueObject<Date> {
	constructor(value: Date | string) {
		super(new Date(value));
	}

	get value() {
		return this._value;
	}

	toString() {
		return this.value.toString();
	}
}
