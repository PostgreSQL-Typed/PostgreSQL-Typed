export type NestedPaths<Type> = Type extends string | number | boolean | Date | RegExp | Uint8Array
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
