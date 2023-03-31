export type Join<T extends unknown[], D extends string> = T extends []
	? ""
	: T extends [string | number]
	? `${T[0]}`
	: T extends [string | number, ...infer R]
	? `${T[0]}${D}${Join<R, D>}`
	: string;
