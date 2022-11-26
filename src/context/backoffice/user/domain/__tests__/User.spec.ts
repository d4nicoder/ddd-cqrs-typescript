import { faker } from "@faker-js/faker";
import { BusinessError } from "../../../../../shared/domain/BusinessError";
import { IdValueObject } from "../../../../../shared/domain/IdValueObject";
import { Time } from "../../../../../shared/utils/Time";
import { UserMother } from "../__mocks__/UserMother";
import { UserActivatedDomainEvent } from "../events/UserActivatedDomainEvent";
import { UserBecameAdminDomainEvent } from "../events/UserBecameAdminDomainEvent";
import { UserChangedExpirationDomainEvent } from "../events/UserChangedExpirationDomainEvent";
import { UserChangedPersonalDataDomainEvent } from "../events/UserChangedPersonalDataDomainEvent";
import { UserDeactivatedDomainEvent } from "../events/UserDeactivatedDomainEvent";
import { UserPasswordChangedDomainEvent } from "../events/UserPasswordChangedDomainEvent";
import { UserRevokedAdminDomainEvent } from "../events/UserRevokedAdminDomainEvent";
import { UserTokenCreatedEvent } from "../events/UserTokenCreatedDomainEvent";
import { UserTokenDeletedEvent } from "../events/UserTokenDeletedDomainEvent";
import { User } from "../User";
import { UserPassword } from "../UserPassword";

describe("User", () => {
	it("should instantiate a user", () => {
		const user = new User({
			id: IdValueObject.generate().value,
			email: faker.internet.email(),
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			fullName: faker.name.fullName(),
			birthDate: faker.date.past(),
			expiresAt: faker.date.future(),
			createdAt: faker.date.past(),
			isActive: faker.datatype.boolean(),
			isAdmin: faker.datatype.boolean(),
			password: UserPassword.createRandom().toPrimitives(),
			tokens: [],
		});

		expect(user).toBeInstanceOf(User);
	});

	it("should change personal data and register event", () => {
		const user = UserMother.random();
		const firstName = faker.name.firstName();
		const lastName = faker.name.lastName();
		const birthDate = faker.date.past();

		user.changePersonalData(firstName, lastName, birthDate);

		expect(user.toPrimitives().firstName).toBe(firstName);
		expect(user.toPrimitives().lastName).toBe(lastName);
		expect(user.toPrimitives().fullName).toBe(`${firstName} ${lastName}`);
		expect(user.toPrimitives().birthDate.toString()).toBe(birthDate.toString());

		const events = user.pullEvents();
		expect(events).toHaveLength(1);
		expect(events[0]).toBeInstanceOf(UserChangedPersonalDataDomainEvent);
	});

	it("should not emit event if personal data is not changed", () => {
		const user = UserMother.random();

		user.changePersonalData(user.toPrimitives().firstName, user.toPrimitives().lastName, user.toPrimitives().birthDate);

		const events = user.pullEvents();
		expect(events).toHaveLength(0);
	});

	it("should change the user expiration date and register event", () => {
		const user = UserMother.random();
		const expiresAt = faker.date.soon();
		user.changeExpiration(expiresAt);

		expect(user.toPrimitives().expiresAt).toEqual(expiresAt);

		const events = user.pullEvents();
		expect(events).toHaveLength(1);
		expect(events[0]).toBeInstanceOf(UserChangedExpirationDomainEvent);
	});

	it("should not emit any event if the expiration date is not changed", () => {
		const expiresAt = faker.date.soon();
		const user = UserMother.withExpiration(expiresAt);
		user.changeExpiration(expiresAt);

		expect(user.pullEvents()).toHaveLength(0);
	});

	it("should deactivate the user and register event", () => {
		const user = UserMother.active();
		user.deActivate();

		expect(user.toPrimitives().isActive).toBe(false);

		const events = user.pullEvents();
		expect(events).toHaveLength(1);
		expect(events[0]).toBeInstanceOf(UserDeactivatedDomainEvent);
	});

	it("should not emit any event if the user is already deactivated", () => {
		const user = UserMother.inactive();
		user.deActivate();

		expect(user.pullEvents()).toHaveLength(0);
	});

	it("should activate the user and register event", () => {
		const user = UserMother.inactive();
		user.activate();

		expect(user.toPrimitives().isActive).toBe(true);

		const events = user.pullEvents();
		expect(events).toHaveLength(1);
		expect(events[0]).toBeInstanceOf(UserActivatedDomainEvent);
	});

	it("should not emit any event if the user is already activated", () => {
		const user = UserMother.active();
		user.activate();

		expect(user.pullEvents()).toHaveLength(0);
	});

	it("should change the user password and register event", () => {
		const user = UserMother.random();
		const originalPassword = user.toPrimitives().password;
		const password = faker.internet.password();
		user.changePassword(password);

		expect(user.toPrimitives().password.hash).not.toBe(originalPassword.hash);
		expect(user.toPrimitives().password.salt).not.toBe(originalPassword.salt);

		const events = user.pullEvents();
		expect(events).toHaveLength(1);
		expect(events[0]).toBeInstanceOf(UserPasswordChangedDomainEvent);
	});

	it("should turn the user into admin and register event", () => {
		const user = UserMother.notAdmin();
		user.becomeAdmin();

		expect(user.toPrimitives().isAdmin).toBe(true);
		const events = user.pullEvents();
		expect(events).toHaveLength(1);
		expect(events[0]).toBeInstanceOf(UserBecameAdminDomainEvent);
	});

	it("should not emit any event if the user is already admin", () => {
		const user = UserMother.admin();
		user.becomeAdmin();

		expect(user.pullEvents()).toHaveLength(0);
	});

	it("should revoke admin privileges and register event", () => {
		const user = UserMother.admin();
		user.revokeAdmin();

		expect(user.toPrimitives().isAdmin).toBe(false);
		const events = user.pullEvents();
		expect(events).toHaveLength(1);
		expect(events[0]).toBeInstanceOf(UserRevokedAdminDomainEvent);
	});

	it("should not emit any event if the user is not admin", () => {
		const user = UserMother.notAdmin();
		user.revokeAdmin();

		expect(user.pullEvents()).toHaveLength(0);
	});

	it("should generate a new token and register event", () => {
		const user = UserMother.random();
		user.generateToken("test");

		expect(user.toPrimitives().tokens).toHaveLength(1);
		const events = user.pullEvents();
		expect(events).toHaveLength(1);
		expect(events[0]).toBeInstanceOf(UserTokenCreatedEvent);
	});

	it("should throw error if there are more than 9 tokens", () => {
		const user = UserMother.withTokens(10);
		expect(() => user.generateToken("test")).toThrow(BusinessError);
	});

	it("should not register event if delete a not found token", () => {
		const user = UserMother.withTokens(0);
		user.deleteToken("test");
		expect(user.pullEvents()).toHaveLength(0);
	});

	it("should delete token and register event", () => {
		const user = UserMother.withTokens(5);
		user.deleteToken(user.toPrimitives().tokens[4].id);

		expect(user.toPrimitives().tokens).toHaveLength(4);
		const events = user.pullEvents();
		expect(events).toHaveLength(1);
		expect(events[0]).toBeInstanceOf(UserTokenDeletedEvent);
	});

	it("should return true if user is active", () => {
		const user = UserMother.active();
		expect(user.isActive()).toBe(true);
	});

	it("should return false if user is inactive", () => {
		const user = UserMother.inactive();
		expect(user.isActive()).toBe(false);
	});

	it("should return true if user has expired", () => {
		const user = UserMother.withExpiration(new Time().subtractDays(1).toDate());
		expect(user.hasExpired()).toBe(true);
	});

	it("should return false if user has not expired", () => {
		const user = UserMother.withExpiration(new Time().addDays(1).toDate());
		expect(user.hasExpired()).toBe(false);
	});

	it("should return true if the password is valid", () => {
		const password = faker.random.alphaNumeric(10);
		const user = UserMother.withPassword(password);
		expect(user.verifyPassword(password)).toBe(true);
	});

	it("should return false if the password is invalid", () => {
		const password = faker.random.alphaNumeric(10);
		const user = UserMother.withPassword(password);
		expect(user.verifyPassword("bad-password")).toBe(false);
	});
});
