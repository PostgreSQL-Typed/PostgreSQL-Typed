import type { PGTPError } from "../util/PGTPError";

export type SafeEquals<DataType> = { success: true; equals: boolean; data: DataType } | { success: false; error: PGTPError };
