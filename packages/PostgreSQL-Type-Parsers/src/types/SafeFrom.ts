import type { PGTPError } from "../util/PGTPError";

export type SafeFrom<DataType, Error = PGTPError> = { success: true; data: DataType } | { success: false; error: Error };
