/* eslint-disable unicorn/filename-case */
import { getErrorMap } from "./errorMap.js";
import { type IssueWithoutMessage, PgTPError } from "./PgTPError.js";

export function getPgTPError(issueData: IssueWithoutMessage): PgTPError {
	return new PgTPError({
		...issueData,
		message: getErrorMap()(issueData).message,
	});
}
export function throwPgTPError(issueData: IssueWithoutMessage): never {
	throw getPgTPError(issueData);
}
