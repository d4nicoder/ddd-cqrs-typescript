import { UserRepository } from "../../domain/UserRepository";
import { MongoDatabaseConnection } from "../../../../../shared/domain/MongoDatabaseConnection";
import { EmailValueObject } from "../../../../../shared/domain/EmailValueObject";
import { User, UserDefinition } from "../../domain/User";
import { Nullable } from "../../../../../shared/types/utility";
import { registerRepository } from "../../../../../shared/container/registerRepository";

@registerRepository()
export class MongoUserRepository extends UserRepository {
	private _collection = "accounting_users";

	constructor(private _connection: MongoDatabaseConnection) {
		super();
	}

	async findByEmail(emailAddress: string): Promise<Nullable<User>> {
		const email = new EmailValueObject(emailAddress);
		const db = await this._connection.getDb();
		const result = await db.collection(this._collection).findOne<UserDefinition>({ email: email.value });
		if (!result) {
			return null;
		}
		return new User(result);
	}

	async findById(id: string): Promise<Nullable<User>> {
		const db = await this._connection.getDb();
		const result = await db.collection(this._collection).findOne<UserDefinition>({ id: id });
		if (!result) {
			return null;
		}
		return new User(result);
	}

	async save(user: User): Promise<void> {
		const db = await this._connection.getDb();
		await db
			.collection(this._collection)
			.updateOne({ id: user.id.value }, { $set: user.toPrimitives() }, { upsert: true });
	}
}
