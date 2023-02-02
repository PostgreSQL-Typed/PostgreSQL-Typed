import type { IssueWithoutMessage } from "../util/PGTPError";

export type IsValid<Type> =
	| { isOfSameType: true; isValid: true; data: Type }
	| { isOfSameType: true; isValid: false; error: IssueWithoutMessage }
	| { isOfSameType: false };
