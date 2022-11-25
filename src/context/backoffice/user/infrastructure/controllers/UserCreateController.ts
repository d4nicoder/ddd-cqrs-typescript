import { Controller, ControllerDefinition, HttpMethod } from "../../../../../shared/domain/Controller";
import { ControllerRequest } from "../../../../../shared/domain/ControllerRequest";
import { ControllerResponse } from "../../../../../shared/domain/ControllerResponse";
import { registerController } from "../../../../../shared/container/registerController";
import { UserCreateService } from "../../application/UserCreateService";
import { UserDefinition } from "../../domain/User";

@registerController()
export class UserCreateController extends Controller {
	getDefinition(): ControllerDefinition {
		return {
			path: "/api/v1/backoffice/user",
			method: "POST",
			requiredAuth: false,
			onlyAdmin: false,
		};
	}

	constructor(private userCreate: UserCreateService) {
		super();
		this.setBodyValidation({
			type: "object",
			properties: {
				id: { type: "string", format: "uuid" },
				firstName: { type: "string" },
				lastName: { type: "string" },
				email: { type: "string" },
				password: { type: "string" },
				birthDate: { type: "string", format: "date-time" },
			},
			required: ["id", "firstName", "lastName", "email", "password", "birthDate"],
		});
	}

	async run(req: ControllerRequest): Promise<ControllerResponse> {
		await this.userCreate.run(req.body as UserDefinition);
		return new ControllerResponse().json({});
	}
}
