export const arrayToEnum = <T extends string, U extends [T, ...T[]]>(items: U): { [k in U[number]]: k } => {
	const object = {} as { [k in U[number]]: k };
	for (const item of items) object[item] = item;
	return object;
};
