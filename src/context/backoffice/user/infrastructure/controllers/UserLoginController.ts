import { registerController } from "../../../../../shared/container/registerController";
import { Controller, ControllerDefinition } from "../../../../../shared/domain/Controller";
import { ControllerRequest } from "../../../../../shared/domain/ControllerRequest";
import { ControllerResponse } from "../../../../../shared/domain/ControllerResponse";
import { Token } from "../../../../../shared/utils/Token";
import { UserAuthByPasswordService } from "../../application/UserAuthByPasswordService";

@registerController()
export class UserLoginController extends Controller {
	constructor(private authByPasswordService: UserAuthByPasswordService) {
		super();
		this.setBodyValidation({
			type: "object",
			properties: {
				email: {
					type: "string",
					format: "email",
				},
				password: {
					type: "string",
				},
			},
			required: ["email", "password"],
		});
	}

	getDefinition(): ControllerDefinition {
		return {
			path: "/api/v1/login",
			method: "POST",
			requiredAuth: false,
			onlyAdmin: false,
		};
	}

	async run(req: ControllerRequest): Promise<ControllerResponse> {
		const { email, password } = req.body as { email: string; password: string };
		const user = await this.authByPasswordService.run({ email, password });

		// set cookie
		const token = Token.sign({ id: user.id.value }, "15d");
		const age = 1000 * 60 * 60 * 24 * 15; // 15 days
		const headers = {
			"Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=${age};`,
		};
		return new ControllerResponse().setHeaders(headers).setStatus(200);
	}
}
