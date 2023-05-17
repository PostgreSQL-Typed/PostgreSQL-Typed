import type { PgTPError } from "../util/PgTPError.js";

export type SafeFrom<DataType, Error = PgTPError> = { success: true; data: DataType } | { success: false; error: Error };
