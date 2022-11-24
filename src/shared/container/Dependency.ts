export interface Newable<T> {
	new (...args: any[]): T;
}

export interface Dependency {
	target: Newable<any>;
	source?: any;
}
