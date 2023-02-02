export type LastPath<T extends unknown[]> = T extends []
	? ""
	: T extends [string | number]
	? `${T[0]}`
	: T extends [string | number, ...infer R]
	? `${LastPath<R>}`
	: string;
