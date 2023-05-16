/* eslint-disable unicorn/filename-case */
import { type IssueWithoutMessage, PGTError } from "@postgresql-typed/util";

import { getErrorMap } from "../util/errorMap.js";

export function getPGTError(issueData: IssueWithoutMessage): PGTError {
	return new PGTError({
		...issueData,
		message: getErrorMap()(issueData).message,
	});
}
