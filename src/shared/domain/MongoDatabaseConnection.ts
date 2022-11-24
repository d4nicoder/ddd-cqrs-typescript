import { Db } from "mongodb";
import { registerDependency } from "../container/registerDependency";

@registerDependency()
export abstract class MongoDatabaseConnection {
	abstract getDb(): Promise<Db>;
}
