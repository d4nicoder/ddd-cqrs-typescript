export interface ControllerRequest {
	path: string;
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	headers: Record<string, string>;
	body: unknown;
	authenticated: boolean;
	user?: {
		id: string;
		isAdmin: boolean;
	};
}
