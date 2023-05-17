import type { ErrorMap, Issue } from "../util/PgTPErrorr.js";

export interface ParseContext {
	issue: Issue | null;
	readonly errorMap: ErrorMap;
	readonly data: unknown[];
}
