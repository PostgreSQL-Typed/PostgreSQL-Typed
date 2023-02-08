export const isOneOf = <T extends U, U>(collection: readonly T[], element: U): element is T => {
	return collection.includes(element as T);
};
