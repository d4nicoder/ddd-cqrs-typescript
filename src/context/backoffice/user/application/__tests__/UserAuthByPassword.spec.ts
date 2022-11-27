import {faker} from "@faker-js/faker";
import {AuthorizationError} from "../../../../../shared/domain/AuthorizationError";
import {BusinessError} from "../../../../../shared/domain/BusinessError";
import {EventBusMock} from "../../../../../shared/infrastructure/__mocks__/EventBusMock";
import {UserMockRepository} from "../../domain/__mocks__/UserMockRepository";
import {UserMother} from "../../domain/__mocks__/UserMother";
import {UserAuthByPasswordService} from "../UserAuthByPasswordService";

describe("UserAuthByPassword", () => {
	it("should throw an error if user does not exists", async () => {
		const userRepository = new UserMockRepository();
		const eventBus = new EventBusMock();
		const service = new UserAuthByPasswordService(userRepository, eventBus);

		await expect(() => service.run({ email: "some@email.com", password: "somePassword" })).rejects.toBeInstanceOf(
			BusinessError,
		);
	});

	it("should throw if password is not valid", async () => {
		const userRepository = new UserMockRepository();
		const eventBus = new EventBusMock();
		const service = new UserAuthByPasswordService(userRepository, eventBus);

		await expect(() => service.run({ email: "some@email.com", password: "somePassword" })).rejects.toBeInstanceOf(
			BusinessError,
		);
	});

	it("should return user if password is valid", async () => {
		const userRepository = new UserMockRepository();
		const eventBus = new EventBusMock();
		const service = new UserAuthByPasswordService(userRepository, eventBus);
		const email = faker.internet.email();
		const password = faker.random.alphaNumeric(10);
		const authedUser = UserMother.withPassword(password);

		userRepository.findByEmailShouldReturn(authedUser);

		const user = await service.run({ email, password });

		userRepository.assertFindByEmailCalledTimes(1);
		userRepository.assertFindByEmailCalledWith(email);
		expect(user).toEqual(authedUser);
		eventBus.assertPublishManyCalledTimes(1);
	});

	it("should throw an error if password is invalid", async () => {
		const userRepository = new UserMockRepository();
		const eventBus = new EventBusMock();
		const service = new UserAuthByPasswordService(userRepository, eventBus);
		const email = faker.internet.email();
		const password = faker.random.alphaNumeric(10);
		const authedUser = UserMother.withPassword(password);

		userRepository.findByEmailShouldReturn(authedUser);

		await expect(() => service.run({ email, password: "1234" })).rejects.toBeInstanceOf(AuthorizationError);
	});

	it("should throw an error if user account is inactive", async () => {
		const userRepository = new UserMockRepository();
		const eventBus = new EventBusMock();
		const service = new UserAuthByPasswordService(userRepository, eventBus);
		const email = faker.internet.email();
		const password = faker.random.alphaNumeric(10);
		const authedUser = UserMother.inactive();

		userRepository.findByEmailShouldReturn(authedUser);

		await expect(() => service.run({ email, password })).rejects.toBeInstanceOf(AuthorizationError);
	});

	it("should throw an error if user account has expired", async () => {
		const userRepository = new UserMockRepository();
		const eventBus = new EventBusMock();
		const service = new UserAuthByPasswordService(userRepository, eventBus);
		const email = faker.internet.email();
		const password = faker.random.alphaNumeric(10);
		const authedUser = UserMother.expiredWithPassword(password);

		userRepository.findByEmailShouldReturn(authedUser);

		await expect(() => service.run({ email, password })).rejects.toBeInstanceOf(AuthorizationError);
	});
});
