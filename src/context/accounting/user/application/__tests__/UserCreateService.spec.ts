import { BusinessError } from "../../../../../shared/domain/BusinessError";
import { EventBusMock } from "../../../../../shared/infrastructure/__mocks__/EventBusMock";
import { UserMockRepository } from "../../domain/__mocks__/UserMockRepository";
import { UserMother } from "../../domain/__mocks__/UserMother";
import { UserCreateService } from "../UserCreateService";

describe("UserCreateService", () => {
	it("should throw an error if user exists", async () => {
		const repositoryMock = new UserMockRepository();
		const eventBusMock = new EventBusMock();
		const service = new UserCreateService(repositoryMock, eventBusMock);

		repositoryMock.findByEmailShouldReturn(UserMother.random());

		await expect(() => service.run(UserMother.random().toPrimitives())).rejects.toBeInstanceOf(BusinessError);
	});

	it("should create a user and publish events", async () => {
		const repositoryMock = new UserMockRepository();
		const eventBusMock = new EventBusMock();
		const service = new UserCreateService(repositoryMock, eventBusMock);
		const userToCreate = UserMother.random();

		await service.run(userToCreate.toPrimitives());

		repositoryMock.assertSaveCalledTimes(1);
		repositoryMock.assertSaveCalledWithPrimitives({
			id: userToCreate.toPrimitives().id,
			email: userToCreate.toPrimitives().email,
			firstName: userToCreate.toPrimitives().firstName,
			lastName: userToCreate.toPrimitives().lastName,
			birthDate: userToCreate.toPrimitives().birthDate,
		});
		eventBusMock.assertPublishManyCalledTimes(1);
	});
});
