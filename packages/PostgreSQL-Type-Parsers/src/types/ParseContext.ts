import type { ErrorMap, Issue } from "../util/PGTPError";

export interface ParseContext {
	issue: Issue | null;
	readonly errorMap: ErrorMap;
	readonly data: unknown[];
}
