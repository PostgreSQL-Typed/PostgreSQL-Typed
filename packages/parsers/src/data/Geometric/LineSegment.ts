import { OID } from "@postgresql-typed/oids";
import { types } from "pg";

import type { ParseContext } from "../../types/ParseContext.js";
import type { ParseReturnType } from "../../types/ParseReturnType.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { arrayParser } from "../../util/arrayParser.js";
import { getParsedType, ParsedType } from "../../util/getParsedType.js";
import { hasKeys } from "../../util/hasKeys.js";
import { isOneOf } from "../../util/isOneOf.js";
import { parser } from "../../util/parser.js";
import { PGTPBase } from "../../util/PGTPBase.js";
import { PGTPConstructorBase } from "../../util/PGTPConstructorBase.js";
import { throwPGTPError } from "../../util/throwPGTPError.js";
import { INVALID, OK } from "../../util/validation.js";
import { Point, type PointObject } from "./Point.js";

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
	 * Returns `true` if `object` is a `LineSegment`, `false` otherwise.
	 */
	isLineSegment(object: any): object is LineSegment;
}

class LineSegmentConstructorClass extends PGTPConstructorBase<LineSegment> implements LineSegmentConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<LineSegment> {
		const [argument, ...otherArguments] = context.data,
			allowedTypes = [ParsedType.string, ParsedType.object],
			parsedType = getParsedType(argument);

		if (parsedType !== ParsedType.object && context.data.length !== 1) {
			this.setIssueForContext(
				context,
				context.data.length > 1
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
			this.setIssueForContext(context, {
				code: "invalid_type",
				expected: allowedTypes as ParsedType[],
				received: parsedType,
			});
			return INVALID;
		}

		switch (parsedType) {
			case "string":
				return this._parseString(context, argument as string);
			default:
				return this._parseObject(context, argument as object, otherArguments);
		}
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<LineSegment> {
		// Remove all whitespace
		argument = argument.replaceAll(/\s/g, "");

		if (/^\[?\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\),\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\)]?$/.test(argument)) {
			if (argument.startsWith("[(") && argument.endsWith(")]")) argument = argument.slice(1, -1);
			const [a, b] = argument
				.split("),(")
				.join("), (")
				.split(", ")
				.map(p => Point.safeFrom(p));

			/* c8 ignore start */
			if (!a.success) {
				this.setIssueForContext(context, a.error.issue);
				return INVALID;
			}

			if (!b.success) {
				this.setIssueForContext(context, b.error.issue);
				return INVALID;
			}
			/* c8 ignore stop */

			return OK(new LineSegmentClass(a.data, b.data));
		}

		this.setIssueForContext(context, {
			code: "invalid_string",
			received: argument,
			expected: "LIKE [(x1,y1),(x2,y2)]",
		});
		return INVALID;
	}

	private _parseObject(context: ParseContext, argument: object, otherArguments: unknown[]): ParseReturnType<LineSegment> {
		if (context.data.length > 2) {
			this.setIssueForContext(context, {
				code: "too_big",
				type: "arguments",
				maximum: 2,
				inclusive: true,
			});
			return INVALID;
		}

		const secondArgument = otherArguments[0],
			parsedType = getParsedType(secondArgument);

		//Input should be [LineSegment]
		if (LineSegment.isLineSegment(argument)) {
			if (parsedType !== "undefined") {
				this.setIssueForContext(context, {
					code: "too_big",
					type: "arguments",
					maximum: 1,
					exact: true,
				});
				return INVALID;
			}

			return OK(new LineSegmentClass(argument.a, argument.b));
		}

		//Input should be [Point, Point]
		if (Point.isPoint(argument)) {
			if (parsedType === "undefined") {
				this.setIssueForContext(context, {
					code: "too_small",
					type: "arguments",
					minimum: 2,
					exact: true,
				});
				return INVALID;
			}

			const parsedObject = Point.safeFrom(secondArgument as string);
			if (!parsedObject.success) {
				this.setIssueForContext(context, parsedObject.error.issue);
				return INVALID;
			}

			return OK(new LineSegmentClass(argument, parsedObject.data));
		}

		//Input should be [LineSegmentObject | RawLineSegmentObject]
		if (parsedType !== "undefined") {
			this.setIssueForContext(context, {
				code: "too_big",
				type: "arguments",
				maximum: 1,
				exact: true,
			});
			return INVALID;
		}

		const parsedObject = hasKeys<LineSegmentObject | RawLineSegmentObject>(argument, [
			["a", "object"],
			["b", "object"],
		]);
		if (!parsedObject.success) {
			switch (true) {
				case parsedObject.otherKeys.length > 0:
					this.setIssueForContext(context, {
						code: "unrecognized_keys",
						keys: parsedObject.otherKeys,
					});
					break;
				case parsedObject.missingKeys.length > 0:
					this.setIssueForContext(context, {
						code: "missing_keys",
						keys: parsedObject.missingKeys,
					});
					break;
				case parsedObject.invalidKeys.length > 0:
					this.setIssueForContext(context, {
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
			this.setIssueForContext(context, parsedA.error.issue);
			return INVALID;
		}

		if (!parsedB.success) {
			this.setIssueForContext(context, parsedB.error.issue);
			return INVALID;
		}

		return OK(new LineSegmentClass(parsedA.data, parsedB.data));
	}

	isLineSegment(object: any): object is LineSegment {
		return object instanceof LineSegmentClass;
	}
}

const LineSegment: LineSegmentConstructor = new LineSegmentConstructorClass();

class LineSegmentClass extends PGTPBase<LineSegment> implements LineSegment {
	constructor(private _a: Point, private _b: Point) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: LineSegment }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = LineSegment.safeFrom(...context.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toString() === this.toString(),
				data: parsed.data,
			});
		}
		this.setIssueForContext(context, parsed.error.issue);
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

types.setTypeParser(OID.lseg as any, parser(LineSegment));
types.setTypeParser(OID._lseg as any, arrayParser(LineSegment));

export { LineSegment, LineSegmentConstructor, LineSegmentObject, RawLineSegmentObject };
