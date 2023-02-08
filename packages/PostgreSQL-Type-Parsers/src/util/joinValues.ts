export const joinValues = <T extends any[]>(array: T, separator = ", "): string => {
	return array.map(value => (typeof value === "string" ? `'${value}'` : value)).join(separator);
};
