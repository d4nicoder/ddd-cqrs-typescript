import { faker } from "@faker-js/faker";
import { DomainServiceMock } from "../../../../../../shared/domain/__mocks__/DomainServiceMock";
import { ControllerRequest } from "../../../../../../shared/domain/ControllerRequest";
import { UserAuthByPasswordService } from "../../../application/UserAuthByPasswordService";
import { UserMother } from "../../../domain/__mocks__/UserMother";
import { UserLoginController } from "../UserLoginController";

describe("UserLoginController", () => {
	it("should return 400 if email is not provided", async () => {
		const request: ControllerRequest = {
			authenticated: false,
			headers: {},
			params: {},
			method: "POST",
			path: "",
			body: {
				password: "somePassword",
			},
		};
		const service = new DomainServiceMock();
		const controller = new UserLoginController(service as unknown as UserAuthByPasswordService);
		const response = await controller.handle(request);
		expect(response.statusCode).toBe(400);
	});

	it("should return 400 if password is not provided", async () => {
		const request: ControllerRequest = {
			authenticated: false,
			headers: {},
			params: {},
			method: "POST",
			path: "",
			body: {
				email: faker.internet.email(),
			},
		};
		const service = new DomainServiceMock();
		const controller = new UserLoginController(service as unknown as UserAuthByPasswordService);
		const response = await controller.handle(request);
		expect(response.statusCode).toBe(400);
	});

	it("should call service with correct params and return 200 with set-cookie header", async () => {
		const email = faker.internet.email();
		const password = faker.random.alphaNumeric(10);
		const request: ControllerRequest = {
			authenticated: false,
			headers: {},
			params: {},
			method: "POST",
			path: "",
			body: {
				email,
				password,
			},
		};
		const service = new DomainServiceMock();
		const user = UserMother.random();
		service.runWillReturn(user);
		const controller = new UserLoginController(service as unknown as UserAuthByPasswordService);

		const response = await controller.handle(request);

		service.assertRunCalledTimes(1);
		service.assertRunCalledWith({ email, password });
		expect(response.statusCode).toBe(200);
		expect(response.headers).toHaveProperty("set-cookie");
	});
});
