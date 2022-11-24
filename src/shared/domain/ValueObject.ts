export abstract class ValueObject<T> {
	protected readonly _value: T;
	abstract get value(): T;

	protected constructor(value: T) {
		this._value = value;
	}
	abstract toString(): string;
}
