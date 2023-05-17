import type { PgTPErrorr } from "../util/PgTPErrorr.js";

export type SafeEquals<DataType> = { success: true; equals: boolean; data: DataType } | { success: false; error: PgTPErrorr };
