import { BigNumber } from "bignumber.js";

import type { SafeFrom } from "../types/SafeFrom.js";
import type { IssueWithoutMessage } from "./PgTPError.js";

export const getBigNumber = (
	min: string,
	max: string,
	options?: {
		allowInfinity?: boolean;
		allowNaN?: boolean;
	}
): ((input: string | number | bigint | BigNumber) => SafeFrom<BigNumber, IssueWithoutMessage>) => {
	const MIN = BigNumber(min),
		MAX = BigNumber(max);

	options ??= {};
	options.allowInfinity ??= false;
	options.allowNaN ??= false;

	return (input: string | number | bigint | BigNumber) => {
		const argument = input.toString().trim();

		// Infinity or -Infinity with a regex
		if (/^[+-]?infinity$/i.test(argument)) {
			// Capitalize the first "i" in Infinity
			return options?.allowInfinity
				? { success: true, data: BigNumber(argument.toLowerCase().replace(/i/i, "I")) }
				: {
						success: false,
						error: {
							code: "invalid_type",
							expected: "string",
							received: "infinity",
						},
				  };
		}

		// NaN with a regex
		if (/^nan$/i.test(argument)) {
			return options?.allowNaN
				? { success: true, data: BigNumber(Number.NaN) }
				: {
						success: false,
						error: {
							code: "invalid_type",
							expected: "string",
							received: "nan",
						},
				  };
		}

		// Match a number with a regex
		if (/^[+-]?\d*\.?\d+([Ee][+-]?\d+)?$/.test(argument)) return parseNumber(argument, MIN, MAX);

		//* If it includes numbers and it must include "," or ".", it's probably a number with a comma or period in it
		if (/\d/.test(argument) && /[,.]/.test(argument)) {
			//* Get the last comma or period
			const lastCommaOrPeriod = argument.lastIndexOf(",") > argument.lastIndexOf(".") ? "," : ".",
				//* Split the string by either comma or period
				splitArgument = argument.split(/[,.]/),
				//* Get the last element of the array
				lastElement = splitArgument.at(-1),
				//* Join the array back together, without any commas or periods except the last one
				joinedArgument = `${splitArgument.slice(0, -1).join("")}.${lastElement}`,
				//* Remove any leading non-numbers (only allow a leading minus or plus sign)
				joinedArgumentWithoutLeadingNonNumbers = joinedArgument.replace(/^\D+/, ""),
				//* The leading non-numbers,
				leadingNonNumbers = joinedArgument.replace(joinedArgumentWithoutLeadingNonNumbers, ""),
				//* If in the leading non-numbers there is a plus or minus sign, get it
				leadingSign = leadingNonNumbers.match(/[+-]/)?.[0] ?? "",
				//* Anything in between the leading sign and the first number
				leadingNonNumbersBetweenSignAndNumber = leadingSign ? leadingNonNumbers.replace(leadingSign, "") : "",
				//* Remove any trailing non-numbers
				joinedArgumentWithoutTrailingNonNumbers = joinedArgumentWithoutLeadingNonNumbers.replace(/\D+$/, ""),
				//* If it has anything that isn't a number or a period within all numbers return false
				hasInvalidCharacters =
					joinedArgumentWithoutTrailingNonNumbers.split(".").some(number => !/^\d+$/.test(number)) || leadingNonNumbersBetweenSignAndNumber.length > 0,
				//* The final number to parse
				finalNumber = `${leadingSign}${joinedArgumentWithoutTrailingNonNumbers}`;

			//* If the last comma or period is in the argument more than once, it's probably a string, not a number, so don't parse it
			if (!hasInvalidCharacters && argument.split(lastCommaOrPeriod).length <= 2) return parseNumber(finalNumber, MIN, MAX);
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

function parseNumber(argument: string, MIN: BigNumber, MAX: BigNumber): SafeFrom<BigNumber, IssueWithoutMessage> {
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
