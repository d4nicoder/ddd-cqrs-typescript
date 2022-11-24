export class AuthenticationError extends Error {
	public readonly info?: any;
	constructor(message: string, info?: any) {
		super(message);
		this.info = info;
	}
}
