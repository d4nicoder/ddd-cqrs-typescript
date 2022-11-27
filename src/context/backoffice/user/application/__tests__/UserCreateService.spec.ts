import {faker} from "@faker-js/faker";
import {BusinessError} from "../../../../../shared/domain/BusinessError";
import {IdValueObject} from "../../../../../shared/domain/IdValueObject";
import {EventBusMock} from "../../../../../shared/infrastructure/__mocks__/EventBusMock";
import {UserMockRepository} from "../../domain/__mocks__/UserMockRepository";
import {UserMother} from "../../domain/__mocks__/UserMother";
import {UserCreation} from "../../domain/User";
import {UserCreateService} from "../UserCreateService";

describe("UserCreateService", () => {
	it("should throw an error if user exists", async () => {
		const repositoryMock = new UserMockRepository();
		const eventBusMock = new EventBusMock();
		const service = new UserCreateService(repositoryMock, eventBusMock);
		const data: UserCreation = {
			birthDate: faker.date.past().toISOString(),
			email: faker.internet.email(),
			firstName: faker.name.firstName(),
			id: IdValueObject.generate().value,
			isAdmin: faker.datatype.boolean(),
			lastName: faker.name.lastName(),
		};

		repositoryMock.findByEmailShouldReturn(UserMother.random());

		await expect(() => service.run(data)).rejects.toBeInstanceOf(BusinessError);
	});

	it("should create a user and publish events", async () => {
		const repositoryMock = new UserMockRepository();
		const eventBusMock = new EventBusMock();
		const service = new UserCreateService(repositoryMock, eventBusMock);
		const data: UserCreation = {
			birthDate: faker.date.past(),
			email: faker.internet.email(),
			firstName: faker.name.firstName(),
			id: IdValueObject.generate().value,
			isAdmin: faker.datatype.boolean(),
			lastName: faker.name.lastName(),
		};

		await service.run(data);

		repositoryMock.assertSaveCalledTimes(1);
		repositoryMock.assertSaveCalledWithPrimitives({
			id: data.id,
			email: data.email.toLowerCase(),
			firstName: data.firstName,
			lastName: data.lastName,
			birthDate: data.birthDate,
		});
		eventBusMock.assertPublishManyCalledTimes(1);
	});
});
