/* eslint-disable unicorn/filename-case */
import { getErrorMap } from "./errorMap.js";
import { type IssueWithoutMessage, PGTPError } from "./PGTPError.js";

export function throwPGTPError(issueData: IssueWithoutMessage): never {
	throw new PGTPError({
		...issueData,
		message: getErrorMap()(issueData).message,
	});
}
