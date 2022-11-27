import {faker} from "@faker-js/faker";
import {IdValueObject} from "../../../../../shared/domain/IdValueObject";
import {User} from "../User";
import {UserPassword} from "../UserPassword";
import {UserToken} from "../UserToken";

export class UserMother {
	static random(): User {
		return new User({
			id: IdValueObject.generate().value,
			email: faker.internet.email(),
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			fullName: faker.name.fullName(),
			birthDate: faker.date.past(),
			expiresAt: faker.date.future(),
			createdAt: faker.date.past(),
			isActive: faker.datatype.boolean(),
			isAdmin: faker.datatype.boolean(),
			password: UserPassword.createRandom().toPrimitives(),
			tokens: [],
		});
	}

	static withExpiration(expiresAt: Date): User {
		return new User({
			...this.random().toPrimitives(),
			expiresAt,
		});
	}

	static active(): User {
		return new User({
			...this.random().toPrimitives(),
			isActive: true,
		});
	}

	static inactive(): User {
		return new User({
			...this.random().toPrimitives(),
			isActive: false,
		});
	}

	static notAdmin(): User {
		return new User({
			...this.random().toPrimitives(),
			isAdmin: false,
		});
	}

	static admin(): User {
		return new User({
			...this.random().toPrimitives(),
			isAdmin: true,
		});
	}

	static withTokens(num: number): User {
		return new User({
			...this.random().toPrimitives(),
			tokens: Array(num)
				.fill(null)
				.map((_, i) => UserToken.create(`test-${i}`).toPrimitives()),
		});
	}

	static withPassword(password: string): User {
		return new User({
			...this.random().toPrimitives(),
			isActive: true,
			expiresAt: faker.date.future(),
			password: UserPassword.create(password).toPrimitives(),
		});
	}

	static expiredWithPassword(password: string): User {
		return new User({
			...this.random().toPrimitives(),
			password: UserPassword.create(password).toPrimitives(),
			expiresAt: faker.date.past(),
		});
	}
}
