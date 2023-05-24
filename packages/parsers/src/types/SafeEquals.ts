import type { PgTPError } from "../util/PgTPError.js";

export type SafeEquals<DataType> = { success: true; equals: boolean; data: DataType } | { success: false; error: PgTPError };
