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
