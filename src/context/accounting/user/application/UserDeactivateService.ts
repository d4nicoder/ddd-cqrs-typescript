import { registerService } from "../../../../shared/container/registerService";
import { BusinessError } from "../../../../shared/domain/BusinessError";
import { DomainService } from "../../../../shared/domain/DomainService";
import { EventBus } from "../../../../shared/infrastructure/EventBus";
import { UserRepository } from "../domain/UserRepository";

/**
 * @description This service is responsible for deactivating a user
 * @class UserDeactivateService
 * @extends {DomainService}
 * @memberof module:accounting/user
 */
@registerService()
export class UserDeactivateService extends DomainService {
	constructor(private userRepository: UserRepository, private eventBus: EventBus) {
		super();
	}

	async run(id: string): Promise<void> {
		const user = await this.userRepository.findById(id);

		if (!user) {
			throw new BusinessError("User not found");
		}

		user.deActivate();
		await this.userRepository.save(user);
		this.eventBus.publishMany(user.pullEvents());
	}
}
