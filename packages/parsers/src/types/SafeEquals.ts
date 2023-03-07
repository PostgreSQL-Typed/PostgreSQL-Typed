import type { PGTPError } from "../util/PGTPError.js";

export type SafeEquals<DataType> = { success: true; equals: boolean; data: DataType } | { success: false; error: PGTPError };
