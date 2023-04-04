import type { Context } from "../types/types/Context.js";
import type { IssueWithoutMessage } from "../util/PGTError.js";

export function setIssueForContext(context: Context, issueData: IssueWithoutMessage): void {
	context.issue = {
		...issueData,
		message: context.errorMap(issueData).message,
	};
}
