import {registerController} from "../../../../../shared/container/registerController";
import {Controller, ControllerDefinition} from "../../../../../shared/domain/Controller";
import {ControllerRequest} from "../../../../../shared/domain/ControllerRequest";
import {ControllerResponse} from "../../../../../shared/domain/ControllerResponse";
import {UserDeactivateService} from "../../application/UserDeactivateService";

@registerController()
export class UserDeactivateController extends Controller {
	constructor(private userDeactivateService: UserDeactivateService) {
		super();
	}
	getDefinition(): ControllerDefinition {
		return {
			method: "PATCH",
			onlyAdmin: true,
			path: "/api/v1/users/:id/deactivate",
			requiredAuth: true,
		};
	}

	async run(req: ControllerRequest): Promise<ControllerResponse> {
		const id = req.params.id;
		await this.userDeactivateService.run(id);
		return new ControllerResponse().setStatus(204);
	}
}
