import { getErrorMap } from "./errorMap";
import { type IssueWithoutMessage, PGTPError } from "./PGTPError";

export function throwPGTPError(issueData: IssueWithoutMessage): never {
	throw new PGTPError({
		...issueData,
		message: getErrorMap()(issueData).message,
	});
}
