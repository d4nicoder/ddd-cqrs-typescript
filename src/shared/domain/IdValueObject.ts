import { validate } from "uuid";
import { randomUUID } from "crypto";
import { ValueObject } from "./ValueObject";

export class IdValueObject extends ValueObject<string> {
	static generate(): IdValueObject {
		return new IdValueObject(randomUUID());
	}

	constructor(value: string) {
		super(value);
		this._validate();
	}

	private _validate() {
		if (!validate(this.value)) {
			throw new Error("Invalid id value");
		}
	}

	get value() {
		return this._value;
	}

	toString(): string {
		return this.value;
	}
}
