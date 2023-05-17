import type { PgTPErrorr } from "../util/PgTPErrorr.js";

export type SafeIsWithinRange<DataType> = { success: true; isWithinRange: boolean; data?: DataType } | { success: false; error: PgTPErrorr };
