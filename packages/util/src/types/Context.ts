import type { ErrorMap, Issue } from "../util/PgTError.js";

export interface Context {
	issue: Issue | undefined;
	readonly errorMap: ErrorMap;
	readonly data: unknown[];
}
