import { User } from "./User";
import { Nullable } from "../../../../shared/types/utility";

export abstract class UserRepository {
	abstract save(user: User): Promise<void>;
	abstract findById(id: string): Promise<Nullable<User>>;
	abstract findByEmail(email: string): Promise<Nullable<User>>;
}
