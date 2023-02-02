import type { PGTPError } from "../util/PGTPError";

export type SafeFrom<DataType> = { success: true; data: DataType } | { success: false; error: PGTPError };
