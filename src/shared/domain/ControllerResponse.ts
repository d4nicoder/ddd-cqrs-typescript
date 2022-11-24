export class ControllerResponse {
	private _statusCode: number = 200;
	get statusCode(): number {
		return this._statusCode;
	}

	private _headers: Record<string, string> = {};
	get headers(): Record<string, string> {
		return this._headers;
	}

	private _content: any;
	get content(): any {
		return this._content;
	}

	setStatus(num: number): ControllerResponse {
		this._statusCode = num;
		return this;
	}

	setHeaders(headers: Record<string, string>): ControllerResponse {
		Object.entries(headers).forEach((header) => {
			this._headers[header[0].toLowerCase().trim()] = header[1];
		});
		return this;
	}

	setHeader(key: string, value: string): ControllerResponse {
		this.setHeaders({ [key]: value });
		return this;
	}

	json(content: Object): ControllerResponse {
		this.setHeader("content-type", "application/json");
		this._content = content;
		return this;
	}
}
