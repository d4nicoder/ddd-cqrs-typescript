export abstract class DomainService {
	abstract run(...args: any): Promise<unknown>;
}
