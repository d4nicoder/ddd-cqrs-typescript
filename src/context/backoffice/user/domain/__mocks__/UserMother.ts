import { faker } from "@faker-js/faker";
import { IdValueObject } from "../../../../../shared/domain/IdValueObject";
import { User } from "../User";
import { UserToken } from '../UserToken'

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
			password: faker.internet.password(),
			salt: faker.random.alphaNumeric(10),
			tokens: []
		});
	}

	static withExpiration(expiresAt: Date): User {
		const user = new User({
			...this.random().toPrimitives(),
			expiresAt,
		});

		return user;
	}

	static active(): User {
		const user = new User({
			...this.random().toPrimitives(),
			isActive: true,
		});

		return user;
	}

	static inactive(): User {
		const user = new User({
			...this.random().toPrimitives(),
			isActive: false,
		});

		return user;
	}

	static notAdmin(): User {
		const user = new User({
			...this.random().toPrimitives(),
			isAdmin: false,
		});

		return user;
	}

	static admin(): User {
		const user = new User({
			...this.random().toPrimitives(),
			isAdmin: true,
		});

		return user;
	}

	static withTokens(num: number): User {
		const user = new User({
			...this.random().toPrimitives(),
			tokens: Array(num).fill(null).map((_, i) => UserToken.create(`test-${i}`).toPrimitives())
		})
		return user
	}
}
