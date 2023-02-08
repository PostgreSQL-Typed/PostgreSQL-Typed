import type { ErrorMap, Issue } from "../util/PGTPError.js";

export interface ParseContext {
	issue: Issue | null;
	readonly errorMap: ErrorMap;
	readonly data: unknown[];
}
