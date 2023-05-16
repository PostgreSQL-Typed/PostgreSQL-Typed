import type { PGTError } from "../util/PGTError.js";

export type Safe<Data, Error = PGTError> = { success: true; data: Data } | { success: false; error: Error };
