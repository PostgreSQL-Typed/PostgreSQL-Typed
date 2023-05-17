import type { PgTError } from "../util/PgTError.js";

export type Safe<Data, Error = PgTError> = { success: true; data: Data } | { success: false; error: Error };
