import type { Constructors } from "../types/Constructors.js";
import type { ObjectFunction } from "../types/ObjectFunction.js";

export const arrayParser =
	<DataType>(constructor: Constructors | ObjectFunction<DataType>, delimiter = '","', prefix?: string) =>
	(value: string | null) => {
		if (value === null) return null;
		//* If the value doesn't start with { and end with }, it's not an ARRAY.
		if (!value.startsWith("{") || !value.endsWith("}")) return null;
		//* Removes the { and } from the string, make an extra space between circles and then split on the extra space.
		let values = value
			.slice(1, -1)
			.split(delimiter)
			.join(delimiter.includes('"') ? '", "' : ", ")
			.split(", ")
			.filter(Boolean);
		//* If the values have a prefix, remove it.
		if (prefix !== undefined) values = values.map(v => v.slice(prefix.length));
		//* Removes the quotes from the strings
		if (delimiter.includes('"')) values = values.map(v => v.slice(1, -1));
		//* Returns the values as Object objects
		try {
			if ("setN" in constructor) constructor = constructor.setN(Number.POSITIVE_INFINITY);
			return values.map(v => constructor.from(v));
		} catch {
			return null;
		}
	};
