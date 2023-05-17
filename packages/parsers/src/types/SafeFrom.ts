import type { PgTPErrorr } from "../util/PgTPErrorr.js";

export type SafeFrom<DataType, Error = PgTPErrorr> = { success: true; data: DataType } | { success: false; error: Error };
