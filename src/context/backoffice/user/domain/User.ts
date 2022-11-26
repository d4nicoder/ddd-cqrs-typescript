import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { BusinessError } from "../../../../shared/domain/BusinessError";
import { StringValueObject } from "../../../../shared/domain/StringValueObject";
import { EmailValueObject } from "../../../../shared/domain/EmailValueObject";
import { DateValueObject } from "../../../../shared/domain/DateValueObject";
import { BoolValueObject } from "../../../../shared/domain/BoolValueObject";
import { Nullable } from "../../../../shared/types/utility";
import { UserActivatedDomainEvent } from "./events/UserActivatedDomainEvent";
import { UserAuthenticatedDomainEvent } from "./events/UserAuthenticatedDomainEvent";
import { UserChangedExpirationDomainEvent } from "./events/UserChangedExpirationDomainEvent";
import { UserChangedPersonalDataDomainEvent } from "./events/UserChangedPersonalDataDomainEvent";
import { UserCreatedDomainEvent } from "./events/UserCreatedDomainEvent";
import { UserBecameAdminDomainEvent } from "./events/UserBecameAdminDomainEvent";
import { UserDeactivatedDomainEvent } from "./events/UserDeactivatedDomainEvent";
import { UserPasswordChangedDomainEvent } from "./events/UserPasswordChangedDomainEvent";
import { UserRevokedAdminDomainEvent } from "./events/UserRevokedAdminDomainEvent";
import { UserTokenCreatedEvent } from "./events/UserTokenCreatedDomainEvent";
import { UserTokenDeletedEvent } from "./events/UserTokenDeletedDomainEvent";
import { UserPassword, UserPasswordDefinition } from "./UserPassword";
import { UserToken, UserTokenDefinition } from "./UserToken";

export interface UserDefinition {
	id: string;
	firstName: string;
	lastName: string;
	fullName: string;
	email: string;
	isAdmin: boolean;
	birthDate: Date;
	createdAt: Date;
	expiresAt: Nullable<Date>;
	isActive: boolean;
	password: UserPasswordDefinition;
	tokens: UserTokenDefinition[];
}

export interface UserCreation {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	birthDate: Date | string;
	isAdmin: boolean;
	password?: string;
}

/**
 * @name User
 * @description This is the user aggregate
 * @domain Accounting
 * @version 1
 */
export class User extends AggregateRoot<UserDefinition> {
	private _firstName: StringValueObject;
	private _lastName: StringValueObject;
	private _fullName: StringValueObject;
	private _email: EmailValueObject;
	private _isAdmin: BoolValueObject;
	private _birthDate: DateValueObject;
	private readonly _createdAt: DateValueObject;
	private _expiresAt: Nullable<DateValueObject>;
	private _isActive: BoolValueObject;
	private _password: UserPassword;
	private _tokens: UserToken[];

	static create(props: UserCreation): User {
		const birthDate = new DateValueObject(props.birthDate).value;
		const user = new User({
			id: props.id,
			firstName: props.firstName,
			lastName: props.lastName,
			email: props.email,
			birthDate: birthDate,
			isAdmin: props.isAdmin,
			createdAt: new Date(),
			fullName: `${props.firstName} ${props.lastName}`,
			expiresAt: null,
			isActive: true,
			password: props.password
				? UserPassword.create(props.password).toPrimitives()
				: UserPassword.createRandom().toPrimitives(),
			tokens: [],
		});

		user.registerEvent(new UserCreatedDomainEvent(user.toPrimitives()));
		return user;
	}

	constructor(user: UserDefinition) {
		super(user.id);
		this._firstName = new StringValueObject(user.firstName);
		this._lastName = new StringValueObject(user.lastName);
		this._fullName = new StringValueObject(user.fullName);
		this._email = new EmailValueObject(user.email);
		this._isAdmin = new BoolValueObject(user.isAdmin);
		this._birthDate = new DateValueObject(user.birthDate);
		this._createdAt = new DateValueObject(user.createdAt);
		this._expiresAt = user.expiresAt ? new DateValueObject(user.expiresAt) : null;
		this._isActive = new BoolValueObject(user.isActive);
		this._password = new UserPassword(user.password);
		this._tokens = user.tokens ? user.tokens.map((t) => new UserToken(t)) : [];

		this._buildName();
	}

	private _buildName() {
		this._fullName = new StringValueObject(`${this._firstName} ${this._lastName}`);
	}

	/**
	 * Change user personal information
	 * @param {string} firstName
	 * @param {string} lastName
	 * @param {Date} birthDate
	 */
	changePersonalData(firstName: string, lastName: string, birthDate: Date) {
		let changes = false;
		if (firstName !== this._firstName.value) {
			this._firstName = new StringValueObject(firstName);
			changes = true;
		}
		if (lastName !== this._lastName.value) {
			this._lastName = new StringValueObject(lastName);
			changes = true;
		}
		if (birthDate !== this._birthDate.value) {
			this._birthDate = new DateValueObject(birthDate);
			changes = true;
		}

		if (!changes) {
			return;
		}

		this._buildName();
		this.registerEvent(new UserChangedPersonalDataDomainEvent(this.toPrimitives()));
	}

	/**
	 * Change the user expiration date
	 * @param {Date} expiration
	 */
	changeExpiration(expiration: Date) {
		if (this._expiresAt?.value.getTime() === expiration.getTime()) {
			return;
		}
		this._expiresAt = new DateValueObject(expiration);

		this.registerEvent(new UserChangedExpirationDomainEvent(this.toPrimitives()));
	}

	/**
	 * Deactivate the user account
	 */
	deActivate() {
		if (!this._isActive.value) {
			return;
		}

		this._isActive = new BoolValueObject(false);
		this.registerEvent(new UserDeactivatedDomainEvent(this.toPrimitives()));
	}

	/**
	 * Activate the user account
	 */
	activate() {
		if (this._isActive.value) {
			return;
		}
		this._isActive = new BoolValueObject(true);

		this.registerEvent(new UserActivatedDomainEvent(this.toPrimitives()));
	}

	/**
	 * Change the user password
	 * @param {string} newPassword
	 */
	changePassword(newPassword: string) {
		this._password = UserPassword.create(newPassword);
		this.registerEvent(new UserPasswordChangedDomainEvent(this.toPrimitives()));
	}

	/**
	 * Check if the user password is valid
	 * @param {string} password
	 * @returns {boolean}
	 */
	verifyPassword(password: string): boolean {
		if (!this._password.verify(password)) {
			return false;
		}

		this.registerEvent(new UserAuthenticatedDomainEvent(this.toPrimitives()));
		return true;
	}

	/**
	 * Return if the user is active
	 * @returns {boolean}
	 */
	isActive(): boolean {
		return this._isActive.value;
	}

	/**
	 * Return if the user account has expired
	 * @returns {boolean}
	 */
	hasExpired(): boolean {
		return this._expiresAt !== null && this._expiresAt.value < new Date();
	}

	/**
	 * Give admin privileges to the user
	 */
	becomeAdmin() {
		if (this._isAdmin.value) {
			return;
		}
		this._isAdmin = new BoolValueObject(true);
		this.registerEvent(new UserBecameAdminDomainEvent(this.toPrimitives()));
	}

	/**
	 * Revoke admin privileges from the user
	 */
	revokeAdmin() {
		if (!this._isAdmin.value) {
			return;
		}
		this._isAdmin = new BoolValueObject(false);
		this.registerEvent(new UserRevokedAdminDomainEvent(this.toPrimitives()));
	}

	/**
	 * Generate a new access token for this user
	 * @param {string} name
	 * @returns {string}
	 */
	generateToken(name: string): string {
		if (this._tokens.length > 9) {
			throw new BusinessError("Reached the maximum number of tokens");
		}
		const token = UserToken.create(name);
		this._tokens.push(token);
		this.registerEvent(
			new UserTokenCreatedEvent({
				id: this.id.value,
				token: token.toPrimitives(),
			}),
		);
		return token.toPrimitives().token;
	}

	/**
	 * Delete a user token by id
	 * @param {string} tokenId
	 */
	deleteToken(tokenId: string) {
		const numTokens = this._tokens.length;
		this._tokens = this._tokens.filter((t) => t.toPrimitives().id !== tokenId);
		if (this._tokens.length === numTokens) {
			return;
		}

		this.registerEvent(
			new UserTokenDeletedEvent({
				id: this.id.value,
				tokenId: tokenId,
			}),
		);
	}

	toPrimitives(): { id: string } & UserDefinition {
		return {
			id: this.id.value,
			firstName: this._firstName.value,
			lastName: this._lastName.value,
			fullName: this._fullName.value,
			email: this._email.value,
			isAdmin: this._isAdmin.value,
			birthDate: this._birthDate.value,
			createdAt: this._createdAt.value,
			expiresAt: this._expiresAt?.value ?? null,
			isActive: this._isActive.value,
			password: this._password.toPrimitives(),
			tokens: this._tokens.map((t) => t.toPrimitives()),
		};
	}
}
