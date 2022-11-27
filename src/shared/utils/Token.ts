import jwt from "jsonwebtoken";
import { ValidationError } from "../domain/ValidationError";
import { config } from "./config";

export class Token {
	static sign(payload: any, expiresIn?: string) {
		const secret = config.get("jwt.secret");
		return jwt.sign(payload, secret, { expiresIn });
	}

	static decode<T>(token: string): T {
		const secret = config.get("jwt.secret");
		if (jwt.verify(token, secret)) {
			return jwt.decode(token) as T;
		}
		throw new ValidationError("Invalid token");
	}
}
