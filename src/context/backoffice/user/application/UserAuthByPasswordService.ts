import {registerService} from "../../../../shared/container/registerService";
import {AuthorizationError} from "../../../../shared/domain/AuthorizationError";
import {BusinessError} from "../../../../shared/domain/BusinessError";
import {DomainService} from "../../../../shared/domain/DomainService";
import {EventBus} from "../../../../shared/infrastructure/EventBus";
import {User} from "../domain/User";
import {UserRepository} from "../domain/UserRepository";

/**
 * @description This service is responsible for authenticating a user by password
 * @class UserAuthByPasswordService
 * @extends {DomainService}
 * @memberof module:accounting/user
 */
@registerService()
export class UserAuthByPasswordService extends DomainService {
	constructor(private repository: UserRepository, private eventBus: EventBus) {
		super();
	}
	async run({ email, password }: { email: string; password: string }): Promise<User> {
		const user = await this.repository.findByEmail(email);

		if (!user) {
			throw new BusinessError("User not found");
		}

		if (!user.isActive()) {
			throw new AuthorizationError("User account is not active");
		}

		if (user.hasExpired()) {
			throw new AuthorizationError("User account has expired");
		}

		if (!user.verifyPassword(password)) {
			throw new AuthorizationError("Unauthorized");
		}
		this.eventBus.publishMany(user.pullEvents());
		return user;
	}
}
