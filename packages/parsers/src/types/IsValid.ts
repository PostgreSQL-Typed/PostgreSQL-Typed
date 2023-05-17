import type { IssueWithoutMessage } from "../util/PgTPErrorr.js";

export type IsValid<Type> =
	| { isOfSameType: true; isValid: true; data: Type }
	| { isOfSameType: true; isValid: false; error: IssueWithoutMessage }
	| { isOfSameType: false };
