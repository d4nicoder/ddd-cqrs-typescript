import { faker } from "@faker-js/faker";
import { DomainServiceMock } from "../../../../../../shared/domain/__mocks__/DomainServiceMock";
import { ControllerRequest } from "../../../../../../shared/domain/ControllerRequest";
import { UserCreateService } from "../../../application/UserCreateService";
import { UserMother } from "../../../domain/__mocks__/UserMother";
import { UserCreateController } from "../UserCreateController";

describe("UserCreateController", () => {
	it("should return 400 if body is invalid", async () => {
		const request: ControllerRequest = {
			authenticated: false,
			body: {},
			headers: {},
			method: "POST",
			path: "",
		};
		const service = new DomainServiceMock();
		const controller = new UserCreateController(service as unknown as UserCreateService);

		const response = await controller.handle(request);
		expect(response.statusCode).toBe(400);
	});

	it("should call the service with correct params", async () => {
		const request: ControllerRequest = {
			authenticated: false,
			body: {
				...UserMother.random().toPrimitives(),
				birthDate: faker.date.past().toISOString(),
			},
			headers: {},
			method: "POST",
			path: "",
		};
		const service = new DomainServiceMock();
		const controller = new UserCreateController(service as unknown as UserCreateService);

		const response = await controller.handle(request);
		expect(response.statusCode).toBe(200);
		service.assertRunCalledTimes(1);
		service.assertRunCalledWith(request.body);
	});
});
