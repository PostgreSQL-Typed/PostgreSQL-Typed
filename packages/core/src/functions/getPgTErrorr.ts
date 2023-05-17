/* eslint-disable unicorn/filename-case */
import { type IssueWithoutMessage, PgTError } from "@postgresql-typed/util";

import { getErrorMap } from "../util/errorMap.js";

export function getPgTErrorr(issueData: IssueWithoutMessage): PgTError {
	return new PgTError({
		...issueData,
		message: getErrorMap()(issueData).message,
	});
}
