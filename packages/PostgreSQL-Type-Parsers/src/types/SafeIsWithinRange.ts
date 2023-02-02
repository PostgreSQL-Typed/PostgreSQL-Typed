import type { PGTPError } from "../util/PGTPError";

export type SafeIsWithinRange<DataType> = { success: true; isWithinRange: boolean; data?: DataType } | { success: false; error: PGTPError };
