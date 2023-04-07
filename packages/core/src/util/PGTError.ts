/* eslint-disable unicorn/filename-case */

import { arrayToEnum, type ParsedType } from "@postgresql-typed/util";

export const IssueCode = arrayToEnum([
	"invalid_key_type",
	"invalid_type",
	"missing_keys",
	"unrecognized_keys",
	"not_ready",
	"too_small",
	"too_big",
	"query_error",
	"invalid_string",
	"invalid_join_type",
]);

export type IssueCode = keyof typeof IssueCode;

export interface InvalidTypeIssue {
	code: typeof IssueCode.invalid_type;
	expected: (ParsedType | "not null" | "not undefined") | (ParsedType | "not null" | "not undefined")[];
	received: ParsedType;
}

export interface UnrecognizedKeysIssue {
	code: typeof IssueCode.unrecognized_keys;
	keys: string[];
}

export interface InvalidKeyTypeIssue extends Omit<InvalidTypeIssue, "code"> {
	code: typeof IssueCode.invalid_key_type;
	objectKey: string;
}

export interface MissingKeysIssue {
	code: typeof IssueCode.missing_keys;
	keys: string[];
}

export interface NotReadyIssue {
	code: typeof IssueCode.not_ready;
}

export interface TooSmallIssue {
	code: typeof IssueCode.too_small;
	minimum: number | bigint | string;
	inclusive?: boolean;
	exact?: boolean;
	type: "array" | "number" | "arguments" | "keys";
}

export interface TooBigIssue {
	code: typeof IssueCode.too_big;
	maximum: number | bigint | string;
	inclusive?: boolean;
	exact?: boolean;
	type: "array" | "number" | "arguments" | "keys" | "depth";
}

export type QueryErrorIssue = {
	code: typeof IssueCode.query_error;
	errorMessage: string;
};

export interface InvalidStringIssue {
	code: typeof IssueCode.invalid_string;
	expected: string | string[];
	received: string;
}

export interface InvalidJoinTypeIssue extends Omit<InvalidStringIssue, "code"> {
	code: typeof IssueCode.invalid_join_type;
}

export type IssueWithoutMessage =
	| InvalidKeyTypeIssue
	| InvalidTypeIssue
	| MissingKeysIssue
	| UnrecognizedKeysIssue
	| NotReadyIssue
	| TooSmallIssue
	| TooBigIssue
	| QueryErrorIssue
	| InvalidStringIssue
	| InvalidJoinTypeIssue;

export type Issue = IssueWithoutMessage & {
	message: string;
};

export class PGTError extends Error {
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
