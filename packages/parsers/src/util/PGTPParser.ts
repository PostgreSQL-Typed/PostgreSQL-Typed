/* eslint-disable unicorn/filename-case */
import type { Constructors } from "../types/Constructors.js";
import type { ObjectFunction } from "../types/ObjectFunction.js";
import type { ParserFromConstructor } from "../types/ParserFromConstructor.js";
import type { SafeFrom } from "../types/SafeFrom.js";
import { getPGTPError } from "./throwPGTPError.js";

type Parsers = Constructors | ObjectFunction<any>;

export const PGTPParser = <Parser extends Parsers | "unknown">(parser: Parser, isArray = false) => new PGTPParserClass(parser, isArray);

export class PGTPParserClass<Parser extends Parsers | "unknown"> {
	_nullable = false;
	_optional = false;
	constructor(public parser: Parser, public isArray: boolean) {}

	nullable(): PGTPParserClass<Parser> {
		this._nullable = true;
		return this;
	}

	optional(): PGTPParserClass<Parser> {
		this._optional = true;
		return this;
	}

	isValid(data: unknown, inner = false): SafeFrom<ParserFromConstructor<Parser> | null | undefined | (ParserFromConstructor<Parser> | null | undefined)[]> {
		if (data === null) {
			return !inner && this._nullable
				? {
						success: true,
						data,
				  }
				: {
						success: false,
						error: getPGTPError({
							code: "invalid_type",
							expected: "not null",
							received: "null",
						}),
				  };
		}
		if (data === undefined) {
			return !inner && this._optional
				? {
						success: true,
						data,
				  }
				: {
						success: false,
						error: getPGTPError({
							code: "invalid_type",
							expected: "not undefined",
							received: "undefined",
						}),
				  };
		}
		if (!inner && this.isArray) {
			if (!Array.isArray(data)) {
				return {
					success: false,
					error: getPGTPError({
						code: "invalid_type",
						expected: "array",
						received: typeof data,
					}),
				};
			}

			const successfull: (ParserFromConstructor<Parser> | null | undefined)[] = [];
			for (const v of data) {
				const result = this.isValid(v, true);
				if (!result.success) return result;
				successfull.push(result.data as any);
			}

			return {
				success: true,
				data: successfull,
			};
		}
		if (this.parser === "unknown") {
			return {
				success: true,
				data: data as any,
			};
		}
		return this.parser.safeFrom(data as any);
	}
}
