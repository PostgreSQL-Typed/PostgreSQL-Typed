/* eslint-disable unicorn/filename-case */
import type { Constructors } from "../types/Constructors.js";
import type { ObjectFunction } from "../types/ObjectFunction.js";
import type { ParserFromConstructor } from "../types/ParserFromConstructor.js";
import type { SafeFrom } from "../types/SafeFrom.js";
import { getPgTPError } from "./throwPgTPError.js";

type Parsers = Constructors | ObjectFunction<any>;

export const PgTPParser = <Parser extends Parsers | "unknown">(parser: Parser, isArray = false) => new PgTPParserClass(parser, isArray);

export class PgTPParserClass<Parser extends Parsers | "unknown"> {
	_nullable = false;
	_optional = false;
	constructor(
		public parser: Parser,
		public isArray: boolean
	) {}

	nullable(): PgTPParserClass<Parser> {
		this._nullable = true;
		return this;
	}

	optional(): PgTPParserClass<Parser> {
		this._optional = true;
		return this;
	}

	isValid(data: unknown, inner = false): SafeFrom<ParserFromConstructor<Parser> | null | undefined | (ParserFromConstructor<Parser> | null | undefined)[]> {
		if (data === null) {
			return !inner && this._nullable
				? {
						data,
						success: true,
				  }
				: {
						error: getPgTPError({
							code: "invalid_type",
							expected: "not null",
							received: "null",
						}),
						success: false,
				  };
		}
		if (data === undefined) {
			return !inner && this._optional
				? {
						data,
						success: true,
				  }
				: {
						error: getPgTPError({
							code: "invalid_type",
							expected: "not undefined",
							received: "undefined",
						}),
						success: false,
				  };
		}
		if (!inner && this.isArray) {
			if (!Array.isArray(data)) {
				return {
					error: getPgTPError({
						code: "invalid_type",
						expected: "array",
						received: typeof data,
					}),
					success: false,
				};
			}

			const successfull: (ParserFromConstructor<Parser> | null | undefined)[] = [];
			for (const v of data) {
				const result = this.isValid(v, true);
				if (!result.success) return result;
				successfull.push(result.data as any);
			}

			return {
				data: successfull,
				success: true,
			};
		}
		if (this.parser === "unknown") {
			return {
				data: data as any,
				success: true,
			};
		}
		return this.parser.safeFrom(data as any);
	}
}
