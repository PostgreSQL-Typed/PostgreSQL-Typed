import type { ObjectFunction } from "../types/ObjectFunction";
import type { ParseContext } from "../types/ParseContext";
import type { ParseReturnType } from "../types/ParseReturnType";
import type { SafeEquals } from "../types/SafeEquals";
import type { SafeFrom } from "../types/SafeFrom";
import type { SafeIsWithinRange } from "../types/SafeIsWithinRange";
import { getParsedType, ParsedType } from "./getParsedType";
import { greaterThan } from "./greaterThan";
import { greaterThanOrEqual } from "./greaterThanOrEqual";
import { hasKeys } from "./hasKeys";
import { isOneOf } from "./isOneOf";
import { lessThan } from "./lessThan";
import { lessThanOrEqual } from "./lessThanOrEqual";
import { PGTPConstructorBase } from "./PGTPConstructorBase";
import { PGTPRangeBase } from "./PGTPRangeBase";
import { throwPGTPError } from "./throwPGTPError";
import { INVALID, OK } from "./validation";

enum LowerRange {
	include = "[",
	exclude = "(",
}
type LowerRangeType = "[" | "(";

const lowerRange = ["[", "("];

enum UpperRange {
	include = "]",
	exclude = ")",
}
type UpperRangeType = "]" | ")";

const upperRange = ["]", ")"];

interface RangeObject<DataType> {
	lower: LowerRange | LowerRangeType;
	upper: UpperRange | UpperRangeType;
	value: [DataType, DataType] | null;
}

interface RawRangeObject<DataTypeObject> {
	lower: LowerRange | LowerRangeType;
	upper: UpperRange | UpperRangeType;
	value: [DataTypeObject, DataTypeObject] | null;
}

interface Range<DataType, DataTypeObject> {
	lower: LowerRange | LowerRangeType;
	upper: UpperRange | UpperRangeType;
	value: [DataType, DataType] | null;
	readonly empty: boolean;

	toString(): string;
	toJSON(): RawRangeObject<DataTypeObject>;

	equals(string: string): boolean;
	equals(value: [DataType, DataType]): boolean;
	equals(value1: DataType, value2: DataType): boolean;
	equals(range: Range<DataType, DataTypeObject>): boolean;
	equals(data: RangeObject<DataType> | RawRangeObject<DataTypeObject>): boolean;
	safeEquals(string: string): SafeEquals<Range<DataType, DataTypeObject>>;
	safeEquals(value: [DataType, DataType]): SafeEquals<Range<DataType, DataTypeObject>>;
	safeEquals(value1: DataType, value2: DataType): SafeEquals<Range<DataType, DataTypeObject>>;
	safeEquals(range: Range<DataType, DataTypeObject>): SafeEquals<Range<DataType, DataTypeObject>>;
	safeEquals(data: RangeObject<DataType> | RawRangeObject<DataTypeObject>): SafeEquals<Range<DataType, DataTypeObject>>;
	isWithinRange(string: string): boolean;
	isWithinRange(datatype: DataType): boolean;
	isWithinRange(data: DataTypeObject): boolean;
	safeIsWithinRange(string: string): SafeIsWithinRange<DataType>;
	safeIsWithinRange(datatype: DataType): SafeIsWithinRange<DataType>;
	safeIsWithinRange(data: DataTypeObject): SafeIsWithinRange<DataType>;
}

interface RangeConstructor<DataType, DataTypeObject> {
	from(string: string): Range<DataType, DataTypeObject>;
	from(value: [DataType, DataType]): Range<DataType, DataTypeObject>;
	from(value1: DataType, value2: DataType): Range<DataType, DataTypeObject>;
	from(range: Range<DataType, DataTypeObject>): Range<DataType, DataTypeObject>;
	from(data: RangeObject<DataType> | RawRangeObject<DataTypeObject>): Range<DataType, DataTypeObject>;
	safeFrom(string: string): SafeFrom<Range<DataType, DataTypeObject>>;
	safeFrom(value: [DataType, DataType]): SafeFrom<Range<DataType, DataTypeObject>>;
	safeFrom(value1: DataType, value2: DataType): SafeFrom<Range<DataType, DataTypeObject>>;
	safeFrom(range: Range<DataType, DataTypeObject>): SafeFrom<Range<DataType, DataTypeObject>>;
	safeFrom(data: RangeObject<DataType> | RawRangeObject<DataTypeObject>): SafeFrom<Range<DataType, DataTypeObject>>;
	/**
	 * Returns `true` if `obj` is a `Range` of the same type as `this`, `false` otherwise.
	 */
	isRange(obj: any): obj is Range<DataType, DataTypeObject>;
}

const getRange = <
	DataType extends {
		equals(other: DataType): boolean;
		toString(): string;
		toJSON(): DataTypeObject;
	},
	DataTypeObject
>(
	object: any,
	isObjectFunc: (obj: any) => obj is DataType,
	identifier: string
) => {
	const Object = object as ObjectFunction<DataType, DataType | DataTypeObject | string>;

	class RangeConstructorClass extends PGTPConstructorBase<Range<DataType, DataTypeObject>> implements RangeConstructor<DataType, DataTypeObject> {
		constructor() {
			super();
		}

		_parse(ctx: ParseContext): ParseReturnType<Range<DataType, DataTypeObject>> {
			const [arg, secondArg] = ctx.data,
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
					return this._parseObject(ctx, arg as object, secondArg);
			}
		}

		private _parseString(ctx: ParseContext, arg: string): ParseReturnType<Range<DataType, DataTypeObject>> {
			if (arg === "empty") {
				return OK(
					new RangeClass({
						lower: LowerRange.include,
						upper: UpperRange.include,
						value: null,
					})
				);
			}

			// If the 0 index is set then that automatically means -1 is set
			const [lower, upper] = [arg.at(0), arg.at(-1)] as [undefined, undefined] | [string, string];
			if (!lower || !lowerRange.includes(lower)) {
				this.setIssueForContext(ctx, {
					code: "invalid_string",
					expected: lowerRange,
					received: lower || "",
				});
				return INVALID;
			}

			if (!upperRange.includes(upper)) {
				this.setIssueForContext(ctx, {
					code: "invalid_string",
					expected: upperRange,
					received: upper,
				});
				return INVALID;
			}

			const value = arg
				.slice(1, -1)
				.split(",")
				.map(v => v.replaceAll('"', ""))
				.map(v => v.replaceAll("\\", ""));

			if (value.length !== 2) {
				this.setIssueForContext(
					ctx,
					value.length > 2
						? {
								code: "too_big",
								type: "array",
								maximum: 2,
								exact: true,
						  }
						: {
								code: "too_small",
								type: "array",
								minimum: 2,
								exact: true,
						  }
				);
				return INVALID;
			}

			const [lowerValue, upperValue] = value.map(v => Object.safeFrom(v));
			if (!lowerValue.success) {
				this.setIssueForContext(ctx, lowerValue.error.issue);
				return INVALID;
			}

			if (!upperValue.success) {
				this.setIssueForContext(ctx, upperValue.error.issue);
				return INVALID;
			}

			if (greaterThan(lowerValue.data, upperValue.data)) {
				this.setIssueForContext(ctx, {
					code: "invalid_range_bound",
					lower: lowerValue.data.toString(),
					upper: upperValue.data.toString(),
				});
				return INVALID;
			}

			return OK(
				new RangeClass({
					lower: lower as LowerRange,
					upper: upper as UpperRange,
					value: [lowerValue.data, upperValue.data],
				})
			);
		}

		private _parseArray(
			ctx: ParseContext,
			arg: unknown[],
			options?: {
				lower?: LowerRange | LowerRangeType;
				upper?: UpperRange | UpperRangeType;
			}
		): ParseReturnType<Range<DataType, DataTypeObject>> {
			if (arg.length !== 2) {
				this.setIssueForContext(
					ctx,
					arg.length > 2
						? {
								code: "too_big",
								type: "array",
								maximum: 2,
								exact: true,
						  }
						: {
								code: "too_small",
								type: "array",
								minimum: 2,
								exact: true,
						  }
				);
				return INVALID;
			}

			const [lower, upper] = arg,
				lowerValue = Object.safeFrom(lower as string),
				upperValue = Object.safeFrom(upper as string);

			if (!lowerValue.success) {
				this.setIssueForContext(ctx, lowerValue.error.issue);
				return INVALID;
			}

			if (!upperValue.success) {
				this.setIssueForContext(ctx, upperValue.error.issue);
				return INVALID;
			}

			if (greaterThan(lowerValue.data, upperValue.data)) {
				this.setIssueForContext(ctx, {
					code: "invalid_range_bound",
					lower: lowerValue.data.toString(),
					upper: upperValue.data.toString(),
				});
				return INVALID;
			}

			return OK(
				new RangeClass({
					lower: options?.lower ?? LowerRange.include,
					upper: options?.upper ?? UpperRange.exclude,
					value: [lowerValue.data, upperValue.data],
				})
			);
		}

		private _parseObject(ctx: ParseContext, arg: object, secondArg: unknown): ParseReturnType<Range<DataType, DataTypeObject>> {
			const parsedType = getParsedType(secondArg);

			if (ctx.data.length > 2) {
				this.setIssueForContext(ctx, {
					code: "too_big",
					type: "arguments",
					maximum: 2,
					inclusive: true,
				});
				return INVALID;
			}

			//Input should be [Range<DataType, DataTypeObject>]
			if (Range.isRange(arg)) {
				if (parsedType !== "undefined") {
					this.setIssueForContext(ctx, {
						code: "too_big",
						type: "arguments",
						maximum: 1,
						exact: true,
					});
					return INVALID;
				}

				return OK(
					new RangeClass({
						lower: arg.lower,
						upper: arg.upper,
						value: arg.value,
					})
				);
			}

			//Input should be [DataType, DataType]
			if (isObjectFunc(arg)) {
				if (parsedType === "undefined") {
					this.setIssueForContext(ctx, {
						code: "too_small",
						type: "arguments",
						minimum: 2,
						exact: true,
					});
					return INVALID;
				}

				const parsedObject = Object.safeFrom(secondArg as string);
				if (!parsedObject.success) {
					this.setIssueForContext(ctx, parsedObject.error.issue);
					return INVALID;
				}

				if (greaterThan(arg, parsedObject.data)) {
					this.setIssueForContext(ctx, {
						code: "invalid_range_bound",
						lower: arg.toString(),
						upper: parsedObject.data.toString(),
					});
					return INVALID;
				}

				return OK(
					new RangeClass({
						lower: LowerRange.include,
						upper: UpperRange.exclude,
						value: [arg, parsedObject.data],
					})
				);
			}

			//Input should be [RangeObject<DataType> | RawRangeObject<DataTypeObject>]
			if (parsedType !== "undefined") {
				this.setIssueForContext(ctx, {
					code: "too_big",
					type: "arguments",
					maximum: 1,
					exact: true,
				});
				return INVALID;
			}

			const parsedObject = hasKeys<RawRangeObject<DataTypeObject> | RangeObject<DataType>>(arg, [
				["lower", "string"],
				["upper", "string"],
				["value", ["array", "null"]],
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

			const { lower, upper, value } = parsedObject.obj;

			if (!lowerRange.includes(lower)) {
				this.setIssueForContext(ctx, {
					code: "invalid_string",
					expected: lowerRange,
					received: lower,
				});
				return INVALID;
			}

			if (!upperRange.includes(upper)) {
				this.setIssueForContext(ctx, {
					code: "invalid_string",
					expected: upperRange,
					received: upper,
				});
				return INVALID;
			}

			if (value === null) {
				return OK(
					new RangeClass({
						lower,
						upper,
						value,
					})
				);
			}

			return this._parseArray(ctx, value, {
				lower,
				upper,
			});
		}

		isRange(obj: any): obj is Range<DataType, DataTypeObject> {
			//@ts-expect-error - This is a hack to get around the fact that the value is private
			return obj instanceof RangeClass && obj._identifier === identifier;
		}
	}

	const Range: RangeConstructor<DataType, DataTypeObject> = new RangeConstructorClass();

	class RangeClass extends PGTPRangeBase<Range<DataType, DataTypeObject>, DataType> implements Range<DataType, DataTypeObject> {
		private _identifier = identifier;
		private _lower: LowerRange | LowerRangeType;
		private _upper: UpperRange | UpperRangeType;
		private _value: [DataType, DataType] | null;
		constructor(data: RangeObject<DataType>) {
			super();

			this._lower = data.lower;
			this._upper = data.upper;
			if (data.value === null) this._value = null;
			else this._value = data.value as [DataType, DataType];

			this._checkEmpty();
		}

		private _checkEmpty() {
			if (
				this._value &&
				((this._lower === LowerRange.include && this._upper === UpperRange.exclude) ||
					(this._lower === LowerRange.exclude && this._upper === UpperRange.include)) &&
				this._value[0].equals(this._value[1])
			)
				this._value = null;
		}

		_equals(input: ParseContext): ParseReturnType<{
			readonly equals: boolean;
			readonly data: Range<DataType, DataTypeObject>;
		}> {
			//@ts-expect-error - _equals receives the same context as _parse
			const parsed = Range.safeFrom(...input.data);
			if (parsed.success) {
				return OK({
					equals: parsed.data.toString() === this.toString(),
					data: parsed.data,
				});
			}
			this.setIssueForContext(input, parsed.error.issue);
			return INVALID;
		}

		_isWithinRange(input: ParseContext): ParseReturnType<{
			readonly isWithinRange: boolean;
			readonly data?: DataType;
		}> {
			//@ts-expect-error - _equals receives the same context as _parse
			const parsed = Object.safeFrom(...input.data);
			if (parsed.success) {
				if (this._value === null) {
					return OK({
						isWithinRange: false,
					});
				}

				return OK({
					isWithinRange:
						(this._lower === LowerRange.include ? greaterThanOrEqual(parsed.data, this._value[0]) : greaterThan(parsed.data, this._value[0])) &&
						(this._upper === UpperRange.include ? lessThanOrEqual(parsed.data, this._value[1]) : lessThan(parsed.data, this._value[1])),
					data: parsed.data,
				});
			}
			this.setIssueForContext(input, parsed.error.issue);
			return INVALID;
		}

		toString(): string {
			if (this._value === null) return "empty";
			return `${this._lower}${this._value[0].toString()},${this._value[1].toString()}${this._upper}`;
		}

		toJSON(): RawRangeObject<DataTypeObject> {
			return {
				lower: this._lower,
				upper: this._upper,
				value: (this._value?.map(v => v.toJSON()) as [DataTypeObject, DataTypeObject]) ?? null,
			};
		}

		get lower(): LowerRange | LowerRangeType {
			return this._lower;
		}

		set lower(value: LowerRange | LowerRangeType) {
			if (!lowerRange.includes(value)) {
				throwPGTPError({
					code: "invalid_string",
					expected: lowerRange,
					received: value,
				});
			}

			this._lower = value;
			this._checkEmpty();
		}

		get upper(): UpperRange | UpperRangeType {
			return this._upper;
		}

		set upper(value: UpperRange | UpperRangeType) {
			if (!upperRange.includes(value)) {
				throwPGTPError({
					code: "invalid_string",
					expected: upperRange,
					received: value,
				});
			}

			this._upper = value;
			this._checkEmpty();
		}

		get value(): [DataType, DataType] | null {
			return this._value;
		}

		set value(value: [DataType, DataType] | null) {
			if (value === null) {
				this._value = null;
				return;
			}

			const parsedType = getParsedType(value);
			if (parsedType !== "array") {
				throwPGTPError({
					code: "invalid_type",
					expected: "array",
					received: parsedType,
				});
			}

			if (value.length !== 2) {
				throwPGTPError(
					value.length > 2
						? {
								code: "too_big",
								type: "array",
								maximum: 2,
								exact: true,
						  }
						: {
								code: "too_small",
								type: "array",
								minimum: 2,
								exact: true,
						  }
				);
			}

			const [lower, upper] = value.map(v => Object.safeFrom(v));

			if (!lower.success) throwPGTPError(lower.error.issue);
			if (!upper.success) throwPGTPError(upper.error.issue);

			this._value = [lower.data, upper.data];
			this._checkEmpty();
		}

		get empty(): boolean {
			return this._value === null;
		}
	}

	return Range;
};

export { getRange, LowerRange, LowerRangeType, Range, RangeConstructor, RangeObject, RawRangeObject, UpperRange, UpperRangeType };
