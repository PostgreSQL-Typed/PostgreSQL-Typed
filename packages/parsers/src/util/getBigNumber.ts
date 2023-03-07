import { BigNumber } from "bignumber.js";

import type { SafeFrom } from "../types/SafeFrom.js";
import type { IssueWithoutMessage } from "./PGTPError.js";

export const getBigNumber = (min: string, max: string): ((input: string | number | bigint | BigNumber) => SafeFrom<BigNumber, IssueWithoutMessage>) => {
	const MIN = BigNumber(min),
		MAX = BigNumber(max);

	return (input: string | number | bigint | BigNumber) => {
		const argument = input.toString().trim();

		// Infinity or -Infinity with a regex
		if (/^[+-]?infinity$/i.test(argument)) {
			// Capitalize the first "i" in Infinity
			return { success: true, data: BigNumber(argument.toLowerCase().replace(/i/i, "I")) };
		}
		// NaN with a regex
		if (/^nan$/i.test(argument)) return { success: true, data: BigNumber(Number.NaN) };

		// Match a number with a regex
		if (/^[+-]?\d*\.?\d+([Ee][+-]?\d+)?$/.test(argument)) {
			const bigNumber = BigNumber(argument);
			if (bigNumber.isLessThan(MIN)) {
				return {
					success: false,
					error: {
						code: "too_small",
						type: "number",
						minimum: MIN.toString(),
						inclusive: true,
					},
				};
			}

			if (bigNumber.isGreaterThan(MAX)) {
				return {
					success: false,
					error: {
						code: "too_big",
						type: "number",
						maximum: MAX.toString(),
						inclusive: true,
					},
				};
			}
			return { success: true, data: bigNumber };
		}

		return {
			success: false,
			error: {
				code: "invalid_string",
				expected: "LIKE 1.23",
				received: argument,
			},
		};
	};
};
