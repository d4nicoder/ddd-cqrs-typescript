import { ValueObject } from "./ValueObject";

export class BoolValueObject extends ValueObject<boolean> {
	constructor(value: boolean) {
		super(value);
	}

	get value() {
		return this._value;
	}

	toString() {
		return this._value.toString();
	}
}
