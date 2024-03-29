/* eslint-disable unicorn/filename-case */

import { arrayToEnum, type ParsedType } from "@postgresql-typed/util";

export const IssueCode = arrayToEnum([
	"invalid_n_length",
	"invalid_date",
	"invalid_key_type",
	"invalid_luxon_date",
	"invalid_range_bound",
	"invalid_string",
	"invalid_timezone",
	"invalid_type",
	"invalid_json",
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
	expected: (ParsedType | "not undefined" | "not null") | (ParsedType | "not undefined" | "not null")[];
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
	received: globalThis.Date;
}

export interface InvalidLuxonDateIssue {
	code: typeof IssueCode.invalid_luxon_date;
	received: luxon.DateTime;
}

export interface InvalidJsonIssue {
	code: typeof IssueCode.invalid_json;
	received: string;
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
	received: number | bigint | string;
	minimum: number | bigint | string;
	inclusive?: boolean;
	exact?: boolean;
	type: "array" | "number" | "bigint" | "arguments";
}

export interface TooBigIssue {
	code: typeof IssueCode.too_big;
	received: number | bigint | string;
	maximum: number | bigint | string;
	inclusive?: boolean;
	exact?: boolean;
	type: "array" | "number" | "bigint" | "arguments";
}

export interface TooBigIssueBytes {
	code: typeof IssueCode.too_big;
	received: number | bigint | string;
	maximum: number | bigint | string;
	inclusive?: boolean;
	exact?: boolean;
	type: "bytes";
	input: string;
}

export interface InvalidNLengthIssue {
	code: typeof IssueCode.invalid_n_length;
	maximum: number;
	received: number;
	input: string;
}

export interface MissingKeysIssue {
	code: typeof IssueCode.missing_keys;
	keys: string[];
}

export interface NotFiniteIssue {
	code: typeof IssueCode.not_finite;
	received: number;
}

export interface NotWholeIssue {
	code: typeof IssueCode.not_whole;
	received: number;
}

export type IssueWithoutMessage =
	| InvalidNLengthIssue
	| InvalidDateIssue
	| InvalidKeyTypeIssue
	| InvalidLuxonDateIssue
	| InvalidRangeBoundIssue
	| InvalidStringIssue
	| InvalidTimezoneIssue
	| InvalidTypeIssue
	| InvalidJsonIssue
	| MissingKeysIssue
	| NotFiniteIssue
	| NotWholeIssue
	| TooBigIssue
	| TooBigIssueBytes
	| TooSmallIssue
	| UnrecognizedKeysIssue;

export type Issue = IssueWithoutMessage & {
	message: string;
};

export class PgTPError extends Error {
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
