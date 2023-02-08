import type { PGTPError } from "../util/PGTPError.js";

export type SafeIsWithinRange<DataType> = { success: true; isWithinRange: boolean; data?: DataType } | { success: false; error: PGTPError };
