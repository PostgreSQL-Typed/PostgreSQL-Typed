/* eslint-disable unicorn/filename-case */
import { getErrorMap } from "../util/errorMap.js";
import { type IssueWithoutMessage, PGTError } from "../util/PGTError.js";

export function getPGTError(issueData: IssueWithoutMessage): PGTError {
	return new PGTError({
		...issueData,
		message: getErrorMap()(issueData).message,
	});
}
