import { getParsedType, ParsedType, type PGTError, type Safe } from "@postgresql-typed/util";

import { getPgTError } from "./getPgTError.js";

export function getRawLimit(limit: number, offset?: number): Safe<string, PGTError> {
	//* Make sure the limit is a number
	const parsedType = getParsedType(limit);
	if (parsedType !== ParsedType.number) {
		return {
			success: false,
			error: getPgTError({
				code: "invalid_type",
				expected: ParsedType.number,
				received: parsedType,
			}),
		};
	}

	//* Make sure the limit is a positive integer
	if (limit < 0) {
		return {
			success: false,
			error: getPgTError({
				code: "too_small",
				type: "number",
				minimum: 0,
				inclusive: true,
			}),
		};
	}

	//* If there is no offset, return the limit
	if (offset === undefined) {
		return {
			success: true,
			data: `LIMIT ${limit}`,
		};
	}

	//* Make sure the offset is a number
	const parsedOffsetType = getParsedType(offset);
	if (parsedOffsetType !== ParsedType.number) {
		return {
			success: false,
			error: getPgTError({
				code: "invalid_type",
				expected: ParsedType.number,
				received: parsedOffsetType,
			}),
		};
	}

	//* Make sure the offset is a positive integer
	if (offset < 0) {
		return {
			success: false,
			error: getPgTError({
				code: "too_small",
				type: "number",
				minimum: 0,
				inclusive: true,
			}),
		};
	}

	//* Return the limit and offset
	return {
		success: true,
		data: `LIMIT ${limit}\nOFFSET ${offset}`,
	};
}
