import type { PgTPError } from "@postgresql-typed/parsers";
import type { PgColumn } from "drizzle-orm/pg-core";

export class PgTError extends Error {
	get error() {
		return this.PgTPError.issue;
	}

	constructor(
		public column: PgColumn<any, any>,
		public PgTPError: PgTPError
	) {
		super();
	}

	toString() {
		return this.message;
	}

	get message() {
		return this.PgTPError.issue.message;
	}

	get code() {
		return this.PgTPError.issue.code;
	}
}
