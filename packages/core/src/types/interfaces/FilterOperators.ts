import type { PGTPError } from "@postgresql-typed/parsers";

import type { PGTError } from "../../util/PGTError.js";
import type { DatabaseData } from "../types/DatabaseData.js";
import type { PostgresData } from "../types/PostgresData.js";
import type { Safe } from "../types/Safe.js";
import type { SelectSubQuery } from "../types/SelectSubQuery.js";

export interface FilterOperators<TValue, InnerPostgresData extends PostgresData, InnerDatabaseData extends DatabaseData> {
	$EQUAL?: TValue | Safe<SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>, PGTError | PGTPError>;
	$NOT_EQUAL?: TValue | Safe<SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>, PGTError | PGTPError>;
	$LESS_THAN?: TValue | Safe<SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>, PGTError | PGTPError>;
	$LESS_THAN_OR_EQUAL?: TValue | Safe<SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>, PGTError | PGTPError>;
	$GREATER_THAN?: TValue | Safe<SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>, PGTError | PGTPError>;
	$GREATER_THAN_OR_EQUAL?: TValue | Safe<SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>, PGTError | PGTPError>;
	$LIKE?: string;
	$NOT_LIKE?: string;
	$ILIKE?: string;
	$NOT_ILIKE?: string;
	$IN?: readonly TValue[] | Safe<SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>, PGTError | PGTPError>;
	$NOT_IN?: readonly TValue[] | Safe<SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>, PGTError | PGTPError>;
	$BETWEEN?: [TValue, TValue];
	$NOT_BETWEEN?: [TValue, TValue];
	$IS_NULL?: true;
	$IS_NOT_NULL?: true;
}
