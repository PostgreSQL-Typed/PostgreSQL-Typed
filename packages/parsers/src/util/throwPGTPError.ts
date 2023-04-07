/* eslint-disable unicorn/filename-case */
import { getErrorMap } from "./errorMap.js";
import { type IssueWithoutMessage, PGTPError } from "./PGTPError.js";

export function getPGTPError(issueData: IssueWithoutMessage): PGTPError {
	return new PGTPError({
		...issueData,
		message: getErrorMap()(issueData).message,
	});
}
export function throwPGTPError(issueData: IssueWithoutMessage): never {
	throw getPGTPError(issueData);
}
