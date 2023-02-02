export const joinValues = <T extends any[]>(array: T, separator = ", "): string => {
	return array.map(val => (typeof val === "string" ? `'${val}'` : val)).join(separator);
};
