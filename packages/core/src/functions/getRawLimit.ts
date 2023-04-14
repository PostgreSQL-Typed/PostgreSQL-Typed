import { getParsedType, ParsedType } from "@postgresql-typed/util";

import type { Safe } from "../types/types/Safe.js";
import type { PGTError } from "../util/PGTError.js";
import { getPGTError } from "./getPGTError.js";

export function getRawLimit(limit: number, offset?: number): Safe<string, PGTError> {
	const parsedType = getParsedType(limit);
	if (parsedType !== ParsedType.number) {
		return {
			success: false,
			error: getPGTError({
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
			data: `LIMIT ${limit}`,
		};
	}

	const parsedOffsetType = getParsedType(offset);
	if (parsedOffsetType !== ParsedType.number) {
		return {
			success: false,
			error: getPGTError({
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
		data: `LIMIT ${limit}\nOFFSET ${offset}`,
	};
}
