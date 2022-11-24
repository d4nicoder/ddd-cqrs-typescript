import { Nullable } from "../../../../../shared/types/utility";
import { User } from "../User";
import { UserRepository } from "../UserRepository";

export class UserMockRepository extends UserRepository {
	private spyFindByEmail = jest.fn();
	private spyFindById = jest.fn();
	private spySave = jest.fn();

	findByEmailShouldReturn(user: Nullable<User>): void {
		this.spyFindByEmail.mockReturnValueOnce(Promise.resolve(user));
	}

	assertFindByEmailCalledTimes(times: number): void {
		expect(this.spyFindByEmail).toBeCalledTimes(times);
	}

	assertFindByEmailCalledWith(email: string): void {
		expect(this.spyFindByEmail).toBeCalledWith(email);
	}

	async findByEmail(email: string): Promise<Nullable<User>> {
		return this.spyFindByEmail(email);
	}

	findByIdShouldReturn(user: Nullable<User>): void {
		this.spyFindById.mockReturnValueOnce(Promise.resolve(user));
	}

	assertFindByIdCalledTimes(times: number): void {
		expect(this.spyFindById).toBeCalledTimes(times);
	}

	assertFindByIdCalledWith(id: string): void {
		expect(this.spyFindById).toBeCalledWith(id);
	}

	findById(id: string): Promise<Nullable<User>> {
		return this.spyFindById(id);
	}

	assertSaveCalledTimes(times: number): void {
		expect(this.spySave).toBeCalledTimes(times);
	}

	assertSaveCalledWith(user: User): void {
		expect(this.spySave).toBeCalledWith(user);
	}

	assertSaveCalledWithPrimitives(object: any) {
		expect(this.spySave.mock.calls[0][0].toPrimitives()).toMatchObject(object);
	}

	async save(user: User): Promise<void> {
		this.spySave(user);
	}
}
