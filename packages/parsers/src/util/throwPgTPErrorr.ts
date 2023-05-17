/* eslint-disable unicorn/filename-case */
import { getErrorMap } from "./errorMap.js";
import { type IssueWithoutMessage, PgTPErrorr } from "./PgTPErrorr.js";

export function getPgTPErrorr(issueData: IssueWithoutMessage): PgTPErrorr {
	return new PgTPErrorr({
		...issueData,
		message: getErrorMap()(issueData).message,
	});
}
export function throwPgTPErrorr(issueData: IssueWithoutMessage): never {
	throw getPgTPErrorr(issueData);
}
