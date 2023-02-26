import { DatabaseData } from "../interfaces/DatabaseData.js";
import { Join } from "./Join.js";

export type TablesBySchema<InnerDatabaseData extends DatabaseData, SchemaName extends keyof InnerDatabaseData["schemas"]> = Join<
	(keyof InnerDatabaseData["schemas"][SchemaName]["tables"])[],
	"."
>;
