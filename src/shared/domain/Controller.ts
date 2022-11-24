import Ajv from "ajv";
import ajvFormat from "ajv-formats";
import { AuthorizationError } from "./AuthorizationError";
import { BusinessError } from "./BusinessError";
import { ControllerRequest } from "./ControllerRequest";
import { ControllerResponse } from "./ControllerResponse";
import { ValidationError } from "./ValidationError";

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface ControllerDefinition {
	path: string;
	method: HttpMethod;
	requiredAuth: boolean;
	onlyAdmin: boolean;
	permission?: string;
}

export abstract class Controller {
	private _bodyValidationSchema: any;

	protected setBodyValidation(schema: any) {
		this._bodyValidationSchema = schema;
	}

	abstract getDefinition(): ControllerDefinition;

	async handle(req: ControllerRequest): Promise<ControllerResponse> {
		if (this.getDefinition().requiredAuth && !req.user) {
			throw new AuthorizationError("Unauthorized");
		}

		if (this._bodyValidationSchema) {
			const ajv = new Ajv();
			ajvFormat(ajv);
			const validate = ajv.compile(this._bodyValidationSchema);
			const valid = validate(req.body);
			if (!valid) {
				return new ControllerResponse().setHeader("x-validation-error", "true").setStatus(400).json(validate.errors!);
			}
		}
		try {
			const response = await this.run(req);
			return response;
		} catch (e: any) {
			if (e instanceof BusinessError) {
				return new ControllerResponse().setStatus(400).json({ error: e.message });
			} else if (e instanceof ValidationError) {
				return new ControllerResponse().setStatus(400).json({ error: e.message });
			} else {
				return new ControllerResponse().setStatus(500).json({ error: "Internal error" });
			}
		}
	}

	abstract run(req: ControllerRequest): Promise<ControllerResponse>;
}
