import { registerService } from "../../../../shared/container/registerService";
import { BusinessError } from "../../../../shared/domain/BusinessError";
import { UserRepository } from "../domain/UserRepository";
import { EventBus } from "../../../../shared/infrastructure/EventBus";
import { DomainService } from "../../../../shared/domain/DomainService";
import { User, UserCreation } from "../domain/User";

/**
 * @description This service is responsible for creating a user
 * @class UserCreateService
 * @extends {DomainService}
 * @memberof module:accounting/user
 */
@registerService()
export class UserCreateService extends DomainService {
	constructor(private userRepository: UserRepository, private eventBus: EventBus) {
		super();
	}

	async run(data: UserCreation): Promise<void> {
		// If user exists, throw
		const existingUser = await this.userRepository.findByEmail(data.email);

		if (existingUser) {
			throw new BusinessError("User exists");
		}

		const user = User.create(data);
		await this.userRepository.save(user);
		this.eventBus.publishMany(user.pullEvents());
	}
}
