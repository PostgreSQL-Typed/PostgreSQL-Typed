import type { PgTErrorr } from "../util/PgTErrorr.js";

export type Safe<Data, Error = PgTErrorr> = { success: true; data: Data } | { success: false; error: Error };
