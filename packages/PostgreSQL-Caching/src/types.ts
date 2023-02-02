export type Include<T, U> = T extends U ? T : never;

export type Filter<TSchema> =
	| Partial<TSchema>
	| ({
			[Property in Join<NestedPaths<TSchema>, ".">]?: Condition<PropertyType<TSchema, Property>>;
	  } & RootFilterOperators<TSchema>);

export type Join<T extends unknown[], D extends string> = T extends []
	? ""
	: T extends [string | number]
	? `${T[0]}`
	: T extends [string | number, ...infer R]
	? `${T[0]}${D}${Join<R, D>}`
	: string;

export type NestedPaths<Type> = Type extends
	| string
	| number
	| boolean
	| Date
	| RegExp
	| Uint8Array
	| ((...args: any[]) => any)
	| {
			_bsontype: string;
	  }
	? []
	: Type extends readonly (infer ArrayType)[]
	? [] | [number, ...NestedPaths<ArrayType>]
	: Type extends Map<string, any>
	? [string]
	: Type extends object
	? {
			[Key in Extract<keyof Type, string>]: Type[Key] extends Type
				? [Key]
				: Type extends Type[Key]
				? [Key]
				: Type[Key] extends readonly (infer ArrayType)[]
				? Type extends ArrayType
					? [Key]
					: ArrayType extends Type
					? [Key]
					: [Key, ...NestedPaths<Type[Key]>]
				: [Key, ...NestedPaths<Type[Key]>];
	  }[Extract<keyof Type, string>]
	: [];

export type Condition<T> = T | FilterOperators<T>;

export const isFilterOperator = (value: any): value is keyof FilterOperators<any> =>
	[
		"$EQUAL",
		"$NOT_EQUAL",
		"$LESS_THAN",
		"$LESS_THAN_OR_EQUAL",
		"$GREATER_THAN",
		"$GREATER_THAN_OR_EQUAL",
		"$LIKE",
		"$NOT_LIKE",
		"$ILIKE",
		"$NOT_ILIKE",
		"$IN",
		"$NOT_IN",
		"$BETWEEN",
		"$NOT_BETWEEN",
		"$IS_NULL",
		"$IS_NOT_NULL",
	].includes(value);

export interface FilterOperators<TValue> {
	$EQUAL?: TValue;
	$NOT_EQUAL?: TValue;
	$LESS_THAN?: TValue;
	$LESS_THAN_OR_EQUAL?: TValue;
	$GREATER_THAN?: TValue;
	$GREATER_THAN_OR_EQUAL?: TValue;
	$LIKE?: string;
	$NOT_LIKE?: string;
	$ILIKE?: string;
	$NOT_ILIKE?: string;
	$IN?: readonly TValue[];
	$NOT_IN?: readonly TValue[];
	$BETWEEN?: [TValue, TValue];
	$NOT_BETWEEN?: [TValue, TValue];
	$IS_NULL?: true;
	$IS_NOT_NULL?: true;
}

export type PropertyType<Type, Property extends string> = string extends Property
	? unknown
	: Property extends keyof Type
	? Type[Property]
	: Property extends `${number}`
	? Type extends readonly (infer ArrayType)[]
		? ArrayType
		: unknown
	: Property extends `${infer Key}.${infer Rest}`
	? Key extends `${number}`
		? Type extends readonly (infer ArrayType)[]
			? PropertyType<ArrayType, Rest>
			: unknown
		: Key extends keyof Type
		? Type[Key] extends Map<string, infer MapType>
			? MapType
			: PropertyType<Type[Key], Rest>
		: unknown
	: unknown;

export interface RootFilterOperators<TSchema> {
	$AND?: Filter<TSchema>[];
	$OR?: Filter<TSchema>[];
}

export const isRootFilterOperator = <TSchema>(key: string): key is keyof RootFilterOperators<TSchema> => ["$AND", "$OR"].includes(key);

export type OrderByDirection = "ASC" | "DESC";
export type OrderByNulls = "NULLS FIRST" | "NULLS LAST";

export type OrderBy = OrderByDirection | OrderByNulls | [OrderByDirection, OrderByNulls];

export interface SelectOptions<TSchema> {
	$WHERE?: Filter<TSchema>;
	$ORDER_BY?: [keyof TSchema, OrderBy?];
	$LIMIT?: number | [number, number];
	$FETCH?: number | [number, number];
}
