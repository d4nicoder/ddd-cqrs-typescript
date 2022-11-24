export const registerDependency = (): ClassDecorator => {
	return <TFunction extends Function>(target: TFunction): TFunction => {
		return target;
	};
};
