import type { Table } from "../../classes/Table.js";
import type { OnQuery } from "./OnQuery.js";

export type JoinQuery<Tables extends Table<any, any, any, any, any>, newTable extends Table<any, any, any, any, any>> =
	| {
			/**
			 * The JoinQuery type, used infront of the JOIN query. (for example: CROSS JOIN)
			 *
			 * CROSS and NATURAL joins do not have an ON clause.
			 */
			$TYPE: "CROSS" | "NATURAL" | "NATURAL INNER" | "NATURAL LEFT" | "NATURAL RIGHT";
	  }
	| {
			/**
			 * The JoinQuery type, used infront of the JOIN query. (for example: INNER JOIN)
			 *
			 * CROSS and NATURAL joins do not have an ON clause.
			 */
			$TYPE?: "INNER" | "LEFT" | "RIGHT" | "FULL" | "FULL OUTER";
			/**
			 *  The ON clause of the JOIN query.
			 *
			 */
			$ON: OnQuery<Tables, newTable>;
	  };
