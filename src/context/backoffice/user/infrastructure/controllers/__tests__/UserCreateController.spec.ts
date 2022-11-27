import {faker} from "@faker-js/faker";
import {DomainServiceMock} from "../../../../../../shared/domain/__mocks__/DomainServiceMock";
import {ControllerRequest} from "../../../../../../shared/domain/ControllerRequest";
import {IdValueObject} from "../../../../../../shared/domain/IdValueObject";
import {UserCreateService} from "../../../application/UserCreateService";
import {UserCreation} from "../../../domain/User";
import {UserCreateController} from "../UserCreateController";

describe("UserCreateController", () => {
	it("should return 400 if body is invalid", async () => {
		const request: ControllerRequest = {
			authenticated: false,
			body: {},
			headers: {},
			params: {},
			method: "POST",
			path: "",
		};
		const service = new DomainServiceMock();
		const controller = new UserCreateController(service as unknown as UserCreateService);

		const response = await controller.handle(request);
		expect(response.statusCode).toBe(400);
	});

	it("should call the service with correct params", async () => {
		const payload: UserCreation = {
			id: IdValueObject.generate().value,
			email: faker.internet.email(),
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			birthDate: faker.date.past().toISOString(),
			isAdmin: faker.datatype.boolean(),
		};
		const request: ControllerRequest = {
			authenticated: false,
			body: payload,
			headers: {},
			params: {},
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
