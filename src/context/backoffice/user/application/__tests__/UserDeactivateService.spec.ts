import { BusinessError } from "../../../../../shared/domain/BusinessError";
import { EventBusMock } from "../../../../../shared/infrastructure/__mocks__/EventBusMock";
import { UserMockRepository } from "../../domain/__mocks__/UserMockRepository";
import { UserMother } from "../../domain/__mocks__/UserMother";
import { UserDeactivateService } from "../UserDeactivateService";

describe("UserDeactivateService", () => {
	it("should throw if user does not exist", async () => {
		const repositoryMock = new UserMockRepository();
		const eventBusMock = new EventBusMock();
		const service = new UserDeactivateService(repositoryMock, eventBusMock);

		repositoryMock.findByIdShouldReturn(null);

		await expect(() => service.run("randomId")).rejects.toBeInstanceOf(BusinessError);
	});

	it("should deactivate a user and publish events", async () => {
		const repositoryMock = new UserMockRepository();
		const eventBusMock = new EventBusMock();
		const service = new UserDeactivateService(repositoryMock, eventBusMock);
		const userToDeactivate = UserMother.random();

		repositoryMock.findByIdShouldReturn(userToDeactivate);

		await service.run(userToDeactivate.id.value);

		repositoryMock.assertSaveCalledTimes(1);
		repositoryMock.assertSaveCalledWithPrimitives({
			id: userToDeactivate.id.value,
			isActive: false,
		});
		eventBusMock.assertPublishManyCalledTimes(1);
	});
});
