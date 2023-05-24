import type { ErrorMap, Issue } from "../util/PgTPError.js";

export interface ParseContext {
	issue: Issue | null;
	readonly errorMap: ErrorMap;
	readonly data: unknown[];
}
