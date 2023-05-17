import type { Constructors } from "../types/Constructors.js";
import type { FromParameters } from "../types/FromParameters.js";
import type { ObjectFunction } from "../types/ObjectFunction.js";
import type { PgTPBasee } from "./PgTPBasee.js";

export const arraySerializer =
	<DataType>(constructor: Constructors | ObjectFunction<PgTPBasee<DataType>>, delimiter = '","') =>
	(value: string | FromParameters<Constructors>[] | null): string => {
		if (value === null) return "NULL";

		if (!Array.isArray(value)) return value;
		if (value.length === 0) return "{}";

		let values: string[];
		try {
			if ("setN" in constructor) constructor = constructor.setN(Number.POSITIVE_INFINITY);
			values = value.map(v => constructor.from(v as string).postgres);
		} catch {
			return "NULL";
		}

		let start = "{",
			end = "}";

		if (delimiter.includes('"')) {
			start = '{"';
			end = '"}';
		}

		return (
			start +
			values
				.map(v => {
					const delimiterWithoutQuotes = delimiter.replaceAll('"', "");
					//* If the value contains the delimiter (without qoutes), escape it.
					if (v.includes(delimiterWithoutQuotes)) v = v.replaceAll(delimiterWithoutQuotes, `\\${delimiterWithoutQuotes}`);

					//* If the value contains a quote and the delimiter contains a quote, escape it.
					if (delimiter.includes('"') && v.includes('"')) v = v.replaceAll('"', '\\"');

					//* If the value contains { or } escape it.
					if (v.includes("{") || v.includes("}")) v = v.replaceAll(/[{}]/g, "\\$&");

					return v;
				})
				.join(delimiter) +
			end
		);
	};
