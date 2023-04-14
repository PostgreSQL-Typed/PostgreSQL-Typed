import { getParsedType, hasKeys, isOneOf, ParsedType } from "@postgresql-typed/util";

import type { Fetch } from "../types/types/Fetch.js";
import type { Safe } from "../types/types/Safe.js";
import type { PGTError } from "../util/PGTError.js";
import { getPGTError } from "./getPGTError.js";

export function getRawFetch(fetch: Fetch): Safe<string, PGTError> {
	const parsedType = getParsedType(fetch);
	if (parsedType !== ParsedType.object) {
		return {
			success: false,
			error: getPGTError({
				code: "invalid_type",
				expected: ParsedType.object,
				received: parsedType,
			}),
		};
	}

	const parsedObject = hasKeys<Fetch>(fetch, [
		["fetch", ParsedType.number],
		["type", [ParsedType.string, ParsedType.undefined]],
		["offset", [ParsedType.number, ParsedType.undefined]],
	]);

	if (!parsedObject.success) {
		return {
			success: false,
			error: getPGTError(
				parsedObject.otherKeys.length > 0
					? {
							code: "unrecognized_keys",
							keys: parsedObject.otherKeys,
					  }
					: parsedObject.missingKeys.length > 0
					? {
							code: "missing_keys",
							keys: parsedObject.missingKeys,
					  }
					: {
							code: "invalid_key_type",
							...parsedObject.invalidKeys[0],
					  }
			),
		};
	}

	const fetchObject = parsedObject.obj;

	fetchObject.type ??= "FIRST";
	if (!isOneOf(["FIRST", "NEXT"], fetchObject.type)) {
		return {
			success: false,
			error: getPGTError({
				code: "invalid_string",
				expected: ["FIRST", "NEXT"],
				received: fetchObject.type,
			}),
		};
	}

	const { fetch: fetchAmount, type, offset } = fetchObject;

	if (fetchAmount < 0) {
		return {
			success: false,
			error: getPGTError({
				code: "too_small",
				type: "number",
				minimum: 0,
				inclusive: true,
			}),
		};
	}

	if (offset === undefined) {
		return {
			success: true,
			data: `FETCH ${type} ${fetchAmount} ${fetchAmount > 1 ? "ROWS" : "ROW"} ONLY`,
		};
	}

	if (offset < 0) {
		return {
			success: false,
			error: getPGTError({
				code: "too_small",
				type: "number",
				minimum: 0,
				inclusive: true,
			}),
		};
	}

	return {
		success: true,
		data: `OFFSET ${offset} ${offset > 1 ? "ROWS" : "ROW"}\nFETCH ${type} ${fetchAmount} ${fetchAmount > 1 ? "ROWS" : "ROW"} ONLY`,
	};
}
