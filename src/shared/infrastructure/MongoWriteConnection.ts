import { Db, MongoClient } from "mongodb";
import { MongoDatabaseConnection } from "../domain/MongoDatabaseConnection";
import { registerDependency } from "../container/registerDependency";

@registerDependency()
export class MongoWriteConnection extends MongoDatabaseConnection {
	private _client?: MongoClient;
	private _database?: Db;

	constructor(private _uri: string, private _dbName: string) {
		console.log(_uri);
		super();
	}

	private async _getConnection(): Promise<MongoClient> {
		if (this._client) {
			return this._client;
		}

		this._client = await new MongoClient(this._uri).connect();
		return this._client;
	}

	async getDb(): Promise<Db> {
		const client = await this._getConnection();
		return client.db(this._dbName);
	}
}
