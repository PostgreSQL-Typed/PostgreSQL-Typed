import type { ErrorMap, Issue } from "../util/PgTErrorr.js";

export interface Context {
	issue: Issue | undefined;
	readonly errorMap: ErrorMap;
	readonly data: unknown[];
}
