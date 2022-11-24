import { DomainService } from "../DomainService";

export class DomainServiceMock extends DomainService {
	private spyRun = jest.fn();

	runWillReturn(value: any): void {
		this.spyRun.mockReturnValue(value);
	}

	assertRunCalledTimes(times: number): void {
		expect(this.spyRun).toBeCalledTimes(times);
	}

	assertRunCalledWith(...args: any): void {
		expect(this.spyRun).toBeCalledWith(...args);
	}

	async run(...args: any): Promise<any> {
		return this.spyRun(...args);
	}
}
