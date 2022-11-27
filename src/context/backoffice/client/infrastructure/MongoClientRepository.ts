import {registerRepository} from "../../../../shared/container/registerRepository";
import {MongoDatabaseConnection} from "../../../../shared/domain/MongoDatabaseConnection";
import {Client} from "../domain/Client";
import {ClientRepository} from "../domain/ClientRepository";

@registerRepository()
export class MongoClientRepository extends ClientRepository {
	private collection = "clients";

	constructor(private _connection: MongoDatabaseConnection) {
		super();
	}

	async save(client: Client): Promise<void> {
		const collection = await this._connection.getCollection(this.collection);
		await collection.updateOne({ id: client.id.value }, { $set: client.toPrimitives() });
	}
}
