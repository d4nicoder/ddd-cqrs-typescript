import { ValueObject } from "./ValueObject";

export class EmailValueObject extends ValueObject<string> {
	constructor(value: string) {
		super(value);
	}

	get value() {
		return this._value.trim().toLowerCase();
	}

	toString(): string {
		return this.value;
	}
}
