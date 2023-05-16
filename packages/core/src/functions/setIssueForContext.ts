import type { Context, IssueWithoutMessage } from "@postgresql-typed/util";

export function setIssueForContext(context: Context, issueData: IssueWithoutMessage): void {
	context.issue = {
		...issueData,
		message: context.errorMap(issueData).message,
	};
}
