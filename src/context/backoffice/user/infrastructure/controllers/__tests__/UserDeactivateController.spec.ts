import {DomainServiceMock} from "../../../../../../shared/domain/__mocks__/DomainServiceMock";
import {ControllerRequest} from "../../../../../../shared/domain/ControllerRequest";
import {IdValueObject} from "../../../../../../shared/domain/IdValueObject";
import {UserDeactivateService} from "../../../application/UserDeactivateService";
import {UserDeactivateController} from "../UserDeactivateController";

describe("UserDeactivateController", () => {
	it("should call service with correct params and return 204", async () => {
		const id = IdValueObject.generate().value;
		const request: ControllerRequest = {
			authenticated: true,
			headers: {},
			method: "PATCH",
			path: "",
			params: {
				id,
			},
			body: {},
			user: {
				id: IdValueObject.generate().value,
				isAdmin: true,
			},
		};
		const service = new DomainServiceMock();

		const controller = new UserDeactivateController(service as unknown as UserDeactivateService);

		const response = await controller.handle(request);

		service.assertRunCalledTimes(1);
		service.assertRunCalledWith(id);
		expect(response.statusCode).toBe(204);
	});
});
