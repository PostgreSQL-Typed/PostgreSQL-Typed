/* eslint-disable unicorn/filename-case */
import { arrayToEnum } from "./arrayToEnum.js";
import { ParsedType } from "./getParsedType.js";

export const IssueCode = arrayToEnum([
	"invalid_bit_length",
	"invalid_date",
	"invalid_key_type",
	"invalid_luxon_date",
	"invalid_range_bound",
	"invalid_string",
	"invalid_timezone",
	"invalid_type",
	"missing_keys",
	"not_finite",
	"not_whole",
	"too_big",
	"too_small",
	"unrecognized_keys",
]);

export type IssueCode = keyof typeof IssueCode;

export interface InvalidTypeIssue {
	code: typeof IssueCode.invalid_type;
	expected: ParsedType | ParsedType[];
	received: ParsedType;
}

export interface InvalidStringIssue {
	code: typeof IssueCode.invalid_string;
	expected: string | string[];
	received: string;
}

export interface InvalidTimezoneIssue {
	code: typeof IssueCode.invalid_timezone;
	received: string;
}

export interface UnrecognizedKeysIssue {
	code: typeof IssueCode.unrecognized_keys;
	keys: string[];
}

export interface InvalidDateIssue {
	code: typeof IssueCode.invalid_date;
}

export interface InvalidLuxonDateIssue {
	code: typeof IssueCode.invalid_luxon_date;
}

export interface InvalidKeyTypeIssue extends Omit<InvalidTypeIssue, "code"> {
	code: typeof IssueCode.invalid_key_type;
	objectKey: string;
}

export interface InvalidRangeBoundIssue {
	code: typeof IssueCode.invalid_range_bound;
	lower: string;
	upper: string;
}

export interface TooSmallIssue {
	code: typeof IssueCode.too_small;
	minimum: number | bigint | string;
	inclusive?: boolean;
	exact?: boolean;
	type: "array" | "number" | "bigint" | "arguments";
}

export interface TooBigIssue {
	code: typeof IssueCode.too_big;
	maximum: number | bigint | string;
	inclusive?: boolean;
	exact?: boolean;
	type: "array" | "number" | "bigint" | "arguments";
}

export interface InvalidBitLengthIssue {
	code: typeof IssueCode.invalid_bit_length;
	maximum: number;
	exact?: boolean;
	received: number;
}

export interface MissingKeysIssue {
	code: typeof IssueCode.missing_keys;
	keys: string[];
}

export interface NotFiniteIssue {
	code: typeof IssueCode.not_finite;
}

export interface NotWholeIssue {
	code: typeof IssueCode.not_whole;
}

export type IssueWithoutMessage =
	| InvalidBitLengthIssue
	| InvalidDateIssue
	| InvalidKeyTypeIssue
	| InvalidLuxonDateIssue
	| InvalidRangeBoundIssue
	| InvalidStringIssue
	| InvalidTimezoneIssue
	| InvalidTypeIssue
	| MissingKeysIssue
	| NotFiniteIssue
	| NotWholeIssue
	| TooBigIssue
	| TooSmallIssue
	| UnrecognizedKeysIssue;

export type Issue = IssueWithoutMessage & {
	message: string;
};

export class PGTPError extends Error {
	get error() {
		return this.issue;
	}

	constructor(public issue: Issue) {
		super();
	}

	toString() {
		return this.message;
	}

	get message() {
		return this.issue.message;
	}

	get code() {
		return this.issue.code;
	}
}

export type ErrorMap = (issue: IssueWithoutMessage) => { message: string };