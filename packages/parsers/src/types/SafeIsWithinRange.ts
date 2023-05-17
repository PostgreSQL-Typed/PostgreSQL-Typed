import type { PgTPError } from "../util/PgTPError.js";

export type SafeIsWithinRange<DataType> = { success: true; isWithinRange: boolean; data?: DataType } | { success: false; error: PgTPError };
