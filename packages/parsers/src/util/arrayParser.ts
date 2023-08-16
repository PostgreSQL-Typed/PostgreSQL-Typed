import type { Constructors } from "../types/Constructors.js";
import type { ObjectFunction } from "../types/ObjectFunction.js";

export const arrayParser =
	<DataType>(constructor: Constructors | ObjectFunction<DataType>, delimiter: "," | ";" = ",") =>
	(value: string | null) => {
		/* c8 ignore next */
		if (value === null) return null;
		try {
			if ("setN" in constructor) constructor = constructor.setN(Number.POSITIVE_INFINITY);
			return parsePostgresArray<any>(value, constructor.from, delimiter);
			/* c8 ignore next 3 */
		} catch {
			return null;
		}
	};

/* c8 ignore start */
function parsePostgresArray<T>(source: string, transform: (string: string) => T, delimiter: "," | ";"): T[];
function parsePostgresArray<T>(
	source: string,
	transform: (string: string) => T,
	delimiter: "," | ";",
	nested: true
): {
	entries: T;
	position: number;
};
function parsePostgresArray<T>(
	source: string,
	transform: (string: string) => T,
	delimiter: "," | ";",
	nested = false
):
	| T[]
	| {
			entries: T[];
			position: number;
	  } {
	let character = "",
		quote = false,
		position = 0,
		dimension = 0;
	const entries: T[] = [];
	let recorded = "";

	const newEntry = function (includeEmpty = false) {
		let entry: any = recorded;

		if (entry.length > 0 || includeEmpty) {
			/* c8 ignore next */
			if (entry === "NULL" && !includeEmpty) entry = null;

			if (entry !== null && transform) entry = transform(entry);

			entries.push(entry);
			recorded = "";
		}
	};

	if (source[0] === "[") {
		while (position < source.length) {
			const char = source[position++];

			if (char === "=") break;
		}
	}

	while (position < source.length) {
		let escaped = false;
		character = source[position++];

		if (character === "\\") {
			character = source[position++];
			escaped = true;
		}

		if (character === "{" && !quote) {
			dimension++;

			if (dimension > 1) {
				const parser = parsePostgresArray(source.slice(position - 1), transform, delimiter, true);

				entries.push(parser.entries);
				position += parser.position - 2;
			}
		} else if (character === "}" && !quote) {
			dimension--;

			if (!dimension) {
				newEntry();

				if (nested) {
					return {
						entries,
						position,
					};
				}
			}
		} else if (character === '"' && !escaped) {
			if (quote) newEntry(true);

			quote = !quote;
		} else if (character === delimiter && !quote) newEntry();
		else recorded += character;
	}

	if (dimension !== 0) throw new Error("array dimension not balanced");

	return entries;
}
