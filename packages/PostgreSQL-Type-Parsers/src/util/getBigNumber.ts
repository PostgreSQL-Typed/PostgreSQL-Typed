import BigNumber from "bignumber.js";

import type { SafeFrom } from "../types/SafeFrom";
import type { IssueWithoutMessage } from "./PGTPError";

export const getBigNumber = (min: string, max: string): ((input: string | number | bigint | BigNumber) => SafeFrom<BigNumber, IssueWithoutMessage>) => {
	const MIN = BigNumber(min),
		MAX = BigNumber(max);

	return (input: string | number | bigint | BigNumber) => {
		const arg = input.toString().trim();

		// Infinity or -Infinity with a regex
		if (/^[-+]?Infinity$/i.test(arg)) {
			// Capitalize the first "i" in Infinity
			return { success: true, data: BigNumber(arg.toLowerCase().replace(/i/i, "I")) };
		}
		// NaN with a regex
		if (/^NaN$/i.test(arg)) return { success: true, data: BigNumber(NaN) };

		// Match a number with a regex
		if (/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(arg)) {
			const bigNumber = BigNumber(arg);
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
				received: arg,
			},
		};
	};
};
