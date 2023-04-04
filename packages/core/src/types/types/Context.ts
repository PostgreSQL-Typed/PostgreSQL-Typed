import type { ErrorMap, Issue } from "../../util/PGTError.js";

export interface Context {
	issue: Issue | undefined;
	readonly errorMap: ErrorMap;
	readonly data: unknown[];
}
