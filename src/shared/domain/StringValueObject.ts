import { ValueObject } from "./ValueObject";

export class StringValueObject extends ValueObject<string> {
	constructor(value: string) {
		super(value);
	}

	get value() {
		return this._value;
	}

	toString() {
		return this.value;
	}
}
