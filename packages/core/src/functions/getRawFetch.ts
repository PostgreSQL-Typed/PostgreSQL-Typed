import { getParsedType, hasKeys, isOneOf, ParsedType, type PGTError, type Safe } from "@postgresql-typed/util";

import type { Fetch } from "../types/types/Fetch.js";
import { getPgTErrorr } from "./getPgTErrorr.js";

export function getRawFetch(fetch: Fetch): Safe<string, PGTError> {
	//* Make sure the fetch is an object
	const parsedType = getParsedType(fetch);
	if (parsedType !== ParsedType.object) {
		return {
			success: false,
			error: getPgTErrorr({
				code: "invalid_type",
				expected: ParsedType.object,
				received: parsedType,
			}),
		};
	}

	//* Make sure the fetch object has the correct keys
	const parsedObject = hasKeys<Fetch>(fetch, [
		["fetch", ParsedType.number],
		["type", [ParsedType.string, ParsedType.undefined]],
		["offset", [ParsedType.number, ParsedType.undefined]],
	]);

	if (!parsedObject.success) {
		return {
			success: false,
			error: getPgTErrorr(
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

	//* Make sure the fetch type is valid and default it to "FIRST"
	fetchObject.type ??= "FIRST";
	if (!isOneOf(["FIRST", "NEXT"], fetchObject.type)) {
		return {
			success: false,
			error: getPgTErrorr({
				code: "invalid_string",
				expected: ["FIRST", "NEXT"],
				received: fetchObject.type,
			}),
		};
	}

	const { fetch: fetchAmount, type, offset } = fetchObject;

	//* Make sure the fetch amount is valid
	if (fetchAmount < 0) {
		return {
			success: false,
			error: getPgTErrorr({
				code: "too_small",
				type: "number",
				minimum: 0,
				inclusive: true,
			}),
		};
	}

	//* If there is no offset, just return the fetch amount
	if (offset === undefined) {
		return {
			success: true,
			data: `FETCH ${type} ${fetchAmount} ${fetchAmount === 1 ? "ROW" : "ROWS"} ONLY`,
		};
	}

	//* Make sure the offset is valid
	if (offset < 0) {
		return {
			success: false,
			error: getPgTErrorr({
				code: "too_small",
				type: "number",
				minimum: 0,
				inclusive: true,
			}),
		};
	}

	//* Return the fetch amount and offset amount
	return {
		success: true,
		data: `OFFSET ${offset} ${offset === 1 ? "ROW" : "ROWS"}\nFETCH ${type} ${fetchAmount} ${fetchAmount === 1 ? "ROW" : "ROWS"} ONLY`,
	};
}
