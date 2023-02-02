export const arrayToEnum = <T extends string, U extends [T, ...T[]]>(items: U): { [k in U[number]]: k } => {
	const obj = {} as { [k in U[number]]: k };
	for (const item of items) obj[item] = item;
	return obj;
};
