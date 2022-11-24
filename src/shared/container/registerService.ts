export const registerService = (): ClassDecorator => {
	return <TFunction extends Function>(target: TFunction): TFunction => {
		return target;
	};
};
