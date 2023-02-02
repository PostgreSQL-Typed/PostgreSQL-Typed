import { types } from "pg";
import { DataType } from "postgresql-data-types";

import type { ParseContext } from "../../types/ParseContext";
import type { ParseReturnType } from "../../types/ParseReturnType";
import type { SafeEquals } from "../../types/SafeEquals";
import type { SafeFrom } from "../../types/SafeFrom";
import { arrayParser } from "../../util/arrayParser";
import { getParsedType, ParsedType } from "../../util/getParsedType";
import { hasKeys } from "../../util/hasKeys";
import { isOneOf } from "../../util/isOneOf";
import { parser } from "../../util/parser";
import { PGTPBase } from "../../util/PGTPBase";
import { PGTPConstructorBase } from "../../util/PGTPConstructorBase";
import { throwPGTPError } from "../../util/throwPGTPError";
import { INVALID, OK } from "../../util/validation";
import { type PointObject, Point } from "./Point";

interface LineSegmentObject {
	a: Point;
	b: Point;
}

interface RawLineSegmentObject {
	a: PointObject;
	b: PointObject;
}

interface LineSegment {
	a: Point;
	b: Point;

	toString(): string;
	toJSON(): RawLineSegmentObject;

	equals(string: string): boolean;
	equals(a: Point, b: Point): boolean;
	equals(lineSegment: LineSegment): boolean;
	equals(object: LineSegmentObject | RawLineSegmentObject): boolean;
	safeEquals(string: string): SafeEquals<LineSegment>;
	safeEquals(a: Point, b: Point): SafeEquals<LineSegment>;
	safeEquals(lineSegment: LineSegment): SafeEquals<LineSegment>;
	safeEquals(object: LineSegmentObject | RawLineSegmentObject): SafeEquals<LineSegment>;
}

interface LineSegmentConstructor {
	from(string: string): LineSegment;
	from(a: Point, b: Point): LineSegment;
	from(lineSegment: LineSegment): LineSegment;
	from(object: LineSegmentObject | RawLineSegmentObject): LineSegment;
	safeFrom(string: string): SafeFrom<LineSegment>;
	safeFrom(a: Point, b: Point): SafeFrom<LineSegment>;
	safeFrom(lineSegment: LineSegment): SafeFrom<LineSegment>;
	safeFrom(object: LineSegmentObject | RawLineSegmentObject): SafeFrom<LineSegment>;
	/**
	 * Returns `true` if `obj` is a `LineSegment`, `false` otherwise.
	 */
	isLineSegment(obj: any): obj is LineSegment;
}

class LineSegmentConstructorClass extends PGTPConstructorBase<LineSegment> implements LineSegmentConstructor {
	constructor() {
		super();
	}

	_parse(ctx: ParseContext): ParseReturnType<LineSegment> {
		const [arg, ...otherArgs] = ctx.data,
			allowedTypes = [ParsedType.string, ParsedType.object],
			parsedType = getParsedType(arg);

		if (parsedType !== ParsedType.object && ctx.data.length !== 1) {
			this.setIssueForContext(
				ctx,
				ctx.data.length > 1
					? {
							code: "too_big",
							type: "arguments",
							maximum: 1,
							exact: true,
					  }
					: {
							code: "too_small",
							type: "arguments",
							minimum: 1,
							exact: true,
					  }
			);
			return INVALID;
		}

		if (!isOneOf(allowedTypes, parsedType)) {
			this.setIssueForContext(ctx, {
				code: "invalid_type",
				expected: allowedTypes as ParsedType[],
				received: parsedType,
			});
			return INVALID;
		}

		switch (parsedType) {
			case "string":
				return this._parseString(ctx, arg as string);
			default:
				return this._parseObject(ctx, arg as object, otherArgs);
		}
	}

	private _parseString(ctx: ParseContext, arg: string): ParseReturnType<LineSegment> {
		// Remove all whitespace
		arg = arg.replaceAll(/\s/g, "");

		if (arg.match(/^\[?\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\),\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\)\]?$/)) {
			if (arg.startsWith("[(") && arg.endsWith(")]")) arg = arg.slice(1, -1);
			const [a, b] = arg
				.split("),(")
				.join("), (")
				.split(", ")
				.map(p => Point.safeFrom(p));

			/* c8 ignore start */
			if (!a.success) {
				this.setIssueForContext(ctx, a.error.issue);
				return INVALID;
			}

			if (!b.success) {
				this.setIssueForContext(ctx, b.error.issue);
				return INVALID;
			}
			/* c8 ignore stop */

			return OK(new LineSegmentClass(a.data, b.data));
		}

		this.setIssueForContext(ctx, {
			code: "invalid_string",
			received: arg,
			expected: "LIKE [(x1,y1),(x2,y2)]",
		});
		return INVALID;
	}

	private _parseObject(ctx: ParseContext, arg: object, otherArgs: unknown[]): ParseReturnType<LineSegment> {
		if (ctx.data.length > 2) {
			this.setIssueForContext(ctx, {
				code: "too_big",
				type: "arguments",
				maximum: 2,
				inclusive: true,
			});
			return INVALID;
		}

		const secondArg = otherArgs[0],
			parsedType = getParsedType(secondArg);

		//Input should be [LineSegment]
		if (LineSegment.isLineSegment(arg)) {
			if (parsedType !== "undefined") {
				this.setIssueForContext(ctx, {
					code: "too_big",
					type: "arguments",
					maximum: 1,
					exact: true,
				});
				return INVALID;
			}

			return OK(new LineSegmentClass(arg.a, arg.b));
		}

		//Input should be [Point, Point]
		if (Point.isPoint(arg)) {
			if (parsedType === "undefined") {
				this.setIssueForContext(ctx, {
					code: "too_small",
					type: "arguments",
					minimum: 2,
					exact: true,
				});
				return INVALID;
			}

			const parsedObject = Point.safeFrom(secondArg as string);
			if (!parsedObject.success) {
				this.setIssueForContext(ctx, parsedObject.error.issue);
				return INVALID;
			}

			return OK(new LineSegmentClass(arg, parsedObject.data));
		}

		//Input should be [LineSegmentObject | RawLineSegmentObject]
		if (parsedType !== "undefined") {
			this.setIssueForContext(ctx, {
				code: "too_big",
				type: "arguments",
				maximum: 1,
				exact: true,
			});
			return INVALID;
		}

		const parsedObject = hasKeys<LineSegmentObject | RawLineSegmentObject>(arg, [
			["a", "object"],
			["b", "object"],
		]);
		if (!parsedObject.success) {
			switch (true) {
				case parsedObject.otherKeys.length > 0:
					this.setIssueForContext(ctx, {
						code: "unrecognized_keys",
						keys: parsedObject.otherKeys,
					});
					break;
				case parsedObject.missingKeys.length > 0:
					this.setIssueForContext(ctx, {
						code: "missing_keys",
						keys: parsedObject.missingKeys,
					});
					break;
				case parsedObject.invalidKeys.length > 0:
					this.setIssueForContext(ctx, {
						code: "invalid_key_type",
						...parsedObject.invalidKeys[0],
					});
					break;
			}
			return INVALID;
		}

		const { a, b } = parsedObject.obj,
			parsedA = Point.safeFrom(a),
			parsedB = Point.safeFrom(b);

		if (!parsedA.success) {
			this.setIssueForContext(ctx, parsedA.error.issue);
			return INVALID;
		}

		if (!parsedB.success) {
			this.setIssueForContext(ctx, parsedB.error.issue);
			return INVALID;
		}

		return OK(new LineSegmentClass(parsedA.data, parsedB.data));
	}

	isLineSegment(obj: any): obj is LineSegment {
		return obj instanceof LineSegmentClass;
	}
}

const LineSegment: LineSegmentConstructor = new LineSegmentConstructorClass();

class LineSegmentClass extends PGTPBase<LineSegment> implements LineSegment {
	constructor(private _a: Point, private _b: Point) {
		super();
	}

	_equals(ctx: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: LineSegment }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = LineSegment.safeFrom(...ctx.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toString() === this.toString(),
				data: parsed.data,
			});
		}
		this.setIssueForContext(ctx, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		return `[${this._a.toString()},${this._b.toString()}]`;
	}

	toJSON(): RawLineSegmentObject {
		return {
			a: this._a.toJSON(),
			b: this._b.toJSON(),
		};
	}

	get a(): Point {
		return this._a;
	}

	set a(a: Point) {
		const parsed = Point.safeFrom(a);
		if (!parsed.success) throwPGTPError(parsed.error.issue);
		this._a = parsed.data;
	}

	get b(): Point {
		return this._b;
	}

	set b(b: Point) {
		const parsed = Point.safeFrom(b);
		if (!parsed.success) throwPGTPError(parsed.error.issue);
		this._b = parsed.data;
	}
}

types.setTypeParser(DataType.lseg as any, parser(LineSegment));
types.setTypeParser(DataType._lseg as any, arrayParser(LineSegment));

export { LineSegment, LineSegmentObject, RawLineSegmentObject };
