import {Client} from "./Client";

export abstract class ClientRepository {
	abstract save(client: Client): Promise<void>;
}
