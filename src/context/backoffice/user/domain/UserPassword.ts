import crypto, { randomBytes } from "crypto";
import { StringValueObject } from "../../../../shared/domain/StringValueObject";

export interface UserPasswordDefinition {
	hash: string;
	salt: string;
}

/**
 * @name UserPassword
 * @description This is the user password value object
 * @domain Accounting
 * @version 1
 * @type ValueObject
 */
export class UserPassword {
	private _hash: StringValueObject;
	private _salt: StringValueObject;

	static hashPassword(password: string, salt: string) {
		return crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512").toString("hex");
	}

	static create(password: string) {
		const salt = randomBytes(32).toString("hex");
		const hash = this.hashPassword(password, salt);
		return new UserPassword({ hash, salt });
	}

	static createRandom() {
		const randomPassword = randomBytes(8).toString("base64");
		return this.create(randomPassword);
	}

	constructor(props: UserPasswordDefinition) {
		this._hash = new StringValueObject(props.hash);
		this._salt = new StringValueObject(props.salt);
	}

	verify(password: string) {
		const hashedPassword = UserPassword.hashPassword(password, this._salt.value);
		return this._hash.value === hashedPassword;
	}

	toPrimitives() {
		return {
			hash: this._hash.value,
			salt: this._salt.value,
		};
	}
}
