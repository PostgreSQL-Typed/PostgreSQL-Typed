import type { ObjectFunction } from "../types/ObjectFunction";
import type { ParseContext } from "../types/ParseContext";
import type { ParseReturnType } from "../types/ParseReturnType";
import type { SafeEquals } from "../types/SafeEquals";
import type { SafeFrom } from "../types/SafeFrom";
import { getParsedType, ParsedType } from "./getParsedType";
import { hasKeys } from "./hasKeys";
import { isOneOf } from "./isOneOf";
import { PGTPBase } from "./PGTPBase";
import { PGTPConstructorBase } from "./PGTPConstructorBase";
import { Range, RawRangeObject } from "./Range";
import { throwPGTPError } from "./throwPGTPError";
import { INVALID, OK } from "./validation";

interface MultiRangeObject<DataType, DataTypeObject> {
	ranges: Range<DataType, DataTypeObject>[];
}

interface RawMultiRangeObject<DataTypeObject> {
	ranges: RawRangeObject<DataTypeObject>[];
}

interface MultiRange<DataType, DataTypeObject> {
	ranges: Range<DataType, DataTypeObject>[];

	toString(): string;
	toJSON(): RawMultiRangeObject<DataTypeObject>;

	equals(string: string): boolean;
	equals(range: Range<DataType, DataTypeObject>, ...ranges: Range<DataType, DataTypeObject>[]): boolean;
	equals(ranges: Range<DataType, DataTypeObject>[]): boolean;
	equals(multiRange: MultiRange<DataType, DataTypeObject>): boolean;
	equals(data: MultiRangeObject<DataType, DataTypeObject> | RawMultiRangeObject<DataTypeObject>): boolean;
	safeEquals(string: string): SafeEquals<MultiRange<DataType, DataTypeObject>>;
	safeEquals(range: Range<DataType, DataTypeObject>, ...ranges: Range<DataType, DataTypeObject>[]): SafeEquals<MultiRange<DataType, DataTypeObject>>;
	safeEquals(ranges: Range<DataType, DataTypeObject>[]): SafeEquals<MultiRange<DataType, DataTypeObject>>;
	safeEquals(multiRange: MultiRange<DataType, DataTypeObject>): SafeEquals<MultiRange<DataType, DataTypeObject>>;
	safeEquals(data: MultiRangeObject<DataType, DataTypeObject> | RawMultiRangeObject<DataTypeObject>): SafeEquals<MultiRange<DataType, DataTypeObject>>;
}

interface MultiRangeConstructor<DataType, DataTypeObject> {
	from(string: string): MultiRange<DataType, DataTypeObject>;
	from(range: Range<DataType, DataTypeObject>, ...ranges: Range<DataType, DataTypeObject>[]): MultiRange<DataType, DataTypeObject>;
	from(ranges: Range<DataType, DataTypeObject>[]): MultiRange<DataType, DataTypeObject>;
	from(multiRange: MultiRange<DataType, DataTypeObject>): MultiRange<DataType, DataTypeObject>;
	from(data: MultiRangeObject<DataType, DataTypeObject> | RawMultiRangeObject<DataTypeObject>): MultiRange<DataType, DataTypeObject>;
	safeFrom(string: string): SafeFrom<MultiRange<DataType, DataTypeObject>>;
	safeFrom(range: Range<DataType, DataTypeObject>, ...ranges: Range<DataType, DataTypeObject>[]): SafeFrom<MultiRange<DataType, DataTypeObject>>;
	safeFrom(ranges: Range<DataType, DataTypeObject>[]): SafeFrom<MultiRange<DataType, DataTypeObject>>;
	safeFrom(multiRange: MultiRange<DataType, DataTypeObject>): SafeFrom<MultiRange<DataType, DataTypeObject>>;
	safeFrom(data: MultiRangeObject<DataType, DataTypeObject> | RawMultiRangeObject<DataTypeObject>): SafeFrom<MultiRange<DataType, DataTypeObject>>;
	/**
	 * Returns `true` if `obj` is a `MultiRange` of the same type as `this`, `false` otherwise.
	 */
	isMultiRange(obj: any): obj is MultiRange<DataType, DataTypeObject>;
}

const getMultiRange = <
	DataType extends {
		equals(other: DataType): boolean;
		toString(): string;
		toJSON(): DataTypeObject;
	},
	DataTypeObject
>(
	object: any,
	isObjectFunc: (obj: any) => obj is Range<DataType, DataTypeObject>,
	identifier: string
) => {
	const Object = object as ObjectFunction<Range<DataType, DataTypeObject>, Range<DataType, DataTypeObject> | RawRangeObject<DataTypeObject> | string>;

	/* eslint-disable brace-style*/
	class MultiRangeConstructorClass
		extends PGTPConstructorBase<MultiRange<DataType, DataTypeObject>>
		implements MultiRangeConstructor<DataType, DataTypeObject>
	{
		/* eslint-enable brace-style*/
		constructor() {
			super();
		}

		_parse(ctx: ParseContext): ParseReturnType<MultiRange<DataType, DataTypeObject>> {
			const [arg, ...otherArgs] = ctx.data,
				allowedTypes = [ParsedType.string, ParsedType.object, ParsedType.array],
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
				case "array":
					return this._parseArray(ctx, arg as unknown[]);
				default:
					return this._parseObject(ctx, arg as object, otherArgs);
			}
		}

		private _parseString(ctx: ParseContext, arg: string): ParseReturnType<MultiRange<DataType, DataTypeObject>> {
			// If the 0 index is set then that automatically means -1 is set
			const [begin, end] = [arg.at(0), arg.at(-1)] as [undefined, undefined] | [string, string];
			if (!begin || begin !== "{") {
				this.setIssueForContext(ctx, {
					code: "invalid_string",
					expected: "{",
					received: begin || "",
				});
				return INVALID;
			}

			if (end !== "}") {
				this.setIssueForContext(ctx, {
					code: "invalid_string",
					expected: "}",
					received: end,
				});
				return INVALID;
			}

			const halfRanges = arg
				.slice(1, -1)
				.split(",")
				.filter(str => str);

			// If halfRanges is an odd number then it's invalid
			if (halfRanges.length % 2 !== 0) {
				this.setIssueForContext(ctx, {
					code: "invalid_string",
					expected: "LIKE {[<DataType>,<DataType>),...}",
					received: arg,
				});
				return INVALID;
			}

			if (halfRanges.length === 0) return OK(new MultiRangeClass([]));

			/**
			 * Half ranges splits "{[1,3),[11,13),[21,23)}"
			 * to: ["[1", "3)", "[11", "13)", "[21", "23)"]
			 * We need to combine the even and odd indexes to get the full ranges
			 * ["[1,3)", "[11,13)", "[21,23)"]
			 */
			const halfRangesEven = halfRanges.filter((_, i) => i % 2 === 0),
				halfRangesOdd = halfRanges.filter((_, i) => i % 2 === 1),
				ranges = halfRangesEven.map((range, i) => `${range},${halfRangesOdd[i]}`).map(range => Object.safeFrom(range)),
				invalidRange = ranges.find(range => !range.success);

			if (invalidRange?.success === false) {
				this.setIssueForContext(ctx, invalidRange.error.issue);
				return INVALID;
			}

			//@ts-expect-error - They are all valid at this point
			return OK(new MultiRangeClass(ranges.map(range => range.data)));
		}

		private _parseArray(ctx: ParseContext, arg: unknown[]): ParseReturnType<MultiRange<DataType, DataTypeObject>> {
			const ranges = arg.map(range => Object.safeFrom(range as string)),
				invalidRange = ranges.find(range => !range.success);

			if (invalidRange?.success === false) {
				this.setIssueForContext(ctx, invalidRange.error.issue);
				return INVALID;
			}

			//@ts-expect-error - They are all valid at this point
			return OK(new MultiRangeClass(ranges.map(range => range.data)));
		}

		private _parseObject(ctx: ParseContext, arg: object, otherArgs: unknown[]): ParseReturnType<MultiRange<DataType, DataTypeObject>> {
			//Input should be [MultiRange<DataType, DataTypeObject>]
			if (MultiRange.isMultiRange(arg)) {
				if (otherArgs.length > 0) {
					this.setIssueForContext(ctx, {
						code: "too_big",
						type: "arguments",
						maximum: 1,
						exact: true,
					});
					return INVALID;
				}

				return OK(new MultiRangeClass(arg.ranges));
			}

			//Input should be [Range<DataType, DataTypeObject>, Range<DataType, DataTypeObject>, ...]
			if (isObjectFunc(arg)) {
				if (otherArgs.length === 0) return OK(new MultiRangeClass([arg]));

				const ranges = [arg, ...otherArgs].map(range => Object.safeFrom(range as string)),
					invalidRange = ranges.find(range => !range.success);

				if (invalidRange?.success === false) {
					this.setIssueForContext(ctx, invalidRange.error.issue);
					return INVALID;
				}

				//@ts-expect-error - They are all valid at this point
				return OK(new MultiRangeClass(ranges.map(range => range.data)));
			}

			//Input should be [MultiRangeObject<DataType, DataTypeObject> | RawMultiRangeObject<DataTypeObject>]
			if (otherArgs.length > 0) {
				this.setIssueForContext(ctx, {
					code: "too_big",
					type: "arguments",
					maximum: 1,
					exact: true,
				});
				return INVALID;
			}

			const parsedObject = hasKeys<MultiRangeObject<DataType, DataTypeObject> | RawMultiRangeObject<DataTypeObject>>(arg, [["ranges", "array"]]);
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

			return this._parseArray(ctx, parsedObject.obj.ranges);
		}

		isMultiRange(obj: any): obj is MultiRange<DataType, DataTypeObject> {
			//@ts-expect-error - This is a hack to get around the fact that the value is private
			return obj instanceof MultiRangeClass && obj._identifier === identifier;
		}
	}

	const MultiRange: MultiRangeConstructor<DataType, DataTypeObject> = new MultiRangeConstructorClass();

	class MultiRangeClass extends PGTPBase<MultiRange<DataType, DataTypeObject>> implements MultiRange<DataType, DataTypeObject> {
		private _identifier = identifier;
		constructor(private _ranges: Range<DataType, DataTypeObject>[]) {
			super();
		}

		_equals(input: ParseContext): ParseReturnType<{
			readonly equals: boolean;
			readonly data: MultiRange<DataType, DataTypeObject>;
		}> {
			//@ts-expect-error - _equals receives the same context as _parse
			const parsed = MultiRange.safeFrom(...input.data);
			if (parsed.success) {
				return OK({
					equals: parsed.data.toString() === this.toString(),
					data: parsed.data,
				});
			}
			this.setIssueForContext(input, parsed.error.issue);
			return INVALID;
		}

		toString(): string {
			return `{${this._ranges.map(r => r.toString()).join(",")}}`;
		}

		toJSON(): RawMultiRangeObject<DataTypeObject> {
			return {
				ranges: this._ranges.map(r => r.toJSON()),
			};
		}

		get ranges(): Range<DataType, DataTypeObject>[] {
			return this._ranges;
		}

		set ranges(ranges: Range<DataType, DataTypeObject>[]) {
			if (!Array.isArray(ranges)) {
				throwPGTPError({
					code: "invalid_type",
					expected: "array",
					received: typeof ranges,
				});
			}

			const values = ranges.map(v => Object.safeFrom(v)),
				invalidValue = values.find(v => !v.success);

			if (invalidValue?.success === false) throwPGTPError(invalidValue.error.issue);

			//@ts-expect-error - They are all valid at this point
			this._ranges = values.map(v => v.data);
		}
	}

	return MultiRange;
};

export { getMultiRange, MultiRange, MultiRangeConstructor, MultiRangeObject, RawMultiRangeObject };
