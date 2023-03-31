import type { ObjectFunction } from "../types/ObjectFunction.js";
import type { ParseContext } from "../types/ParseContext.js";
import type { ParseReturnType } from "../types/ParseReturnType.js";
import type { SafeEquals } from "../types/SafeEquals.js";
import type { SafeFrom } from "../types/SafeFrom.js";
import type { SafeIsWithinRange } from "../types/SafeIsWithinRange.js";
import { getParsedType, ParsedType } from "./getParsedType.js";
import { greaterThan } from "./greaterThan.js";
import { greaterThanOrEqual } from "./greaterThanOrEqual.js";
import { hasKeys } from "./hasKeys.js";
import { isOneOf } from "./isOneOf.js";
import { lessThan } from "./lessThan.js";
import { lessThanOrEqual } from "./lessThanOrEqual.js";
import { PGTPConstructorBase } from "./PGTPConstructorBase.js";
import { PGTPRangeBase } from "./PGTPRangeBase.js";
import { throwPGTPError } from "./throwPGTPError.js";
import { INVALID, OK } from "./validation.js";

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
	values: [DataType, DataType] | null;
}

interface RawRangeObject<DataTypeObject> {
	lower: LowerRange | LowerRangeType;
	upper: UpperRange | UpperRangeType;
	values: [DataTypeObject, DataTypeObject] | null;
}

interface Range<DataType, DataTypeObject> {
	lower: LowerRange | LowerRangeType;
	upper: UpperRange | UpperRangeType;
	values: [DataType, DataType] | null;
	readonly empty: boolean;

	value: string;

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
	 * Returns `true` if `object` is a `Range` of the same type as `this`, `false` otherwise.
	 */
	isRange(object: any): object is Range<DataType, DataTypeObject>;
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
	isObjectFunction: (object: any) => object is DataType,
	identifier: string
) => {
	const Object = object as ObjectFunction<DataType, DataType | DataTypeObject | string>;

	class RangeConstructorClass extends PGTPConstructorBase<Range<DataType, DataTypeObject>> implements RangeConstructor<DataType, DataTypeObject> {
		constructor() {
			super();
		}

		_parse(context: ParseContext): ParseReturnType<Range<DataType, DataTypeObject>> {
			const [argument, secondArgument] = context.data,
				allowedTypes = [ParsedType.string, ParsedType.object, ParsedType.array],
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
				case "array":
					return this._parseArray(context, argument as unknown[]);
				default:
					return this._parseObject(context, argument as object, secondArgument);
			}
		}

		private _parseString(context: ParseContext, argument: string): ParseReturnType<Range<DataType, DataTypeObject>> {
			if (argument === "empty") {
				return OK(
					new RangeClass({
						lower: LowerRange.include,
						upper: UpperRange.include,
						values: null,
					})
				);
			}

			// If the 0 index is set then that automatically means -1 is set
			const [lower, upper] = [argument.at(0), argument.at(-1)] as [undefined, undefined] | [string, string];
			if (!lower || !lowerRange.includes(lower)) {
				this.setIssueForContext(context, {
					code: "invalid_string",
					expected: lowerRange,
					received: lower || "",
				});
				return INVALID;
			}

			if (!upperRange.includes(upper)) {
				this.setIssueForContext(context, {
					code: "invalid_string",
					expected: upperRange,
					received: upper,
				});
				return INVALID;
			}

			const value = argument
				.slice(1, -1)
				.split(",")
				.map(v => v.replaceAll('"', ""))
				.map(v => v.replaceAll("\\", ""));

			if (value.length !== 2) {
				this.setIssueForContext(
					context,
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
				this.setIssueForContext(context, lowerValue.error.issue);
				return INVALID;
			}

			if (!upperValue.success) {
				this.setIssueForContext(context, upperValue.error.issue);
				return INVALID;
			}

			if (greaterThan(lowerValue.data, upperValue.data)) {
				this.setIssueForContext(context, {
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
					values: [lowerValue.data, upperValue.data],
				})
			);
		}

		private _parseArray(
			context: ParseContext,
			argument: unknown[],
			options?: {
				lower?: LowerRange | LowerRangeType;
				upper?: UpperRange | UpperRangeType;
			}
		): ParseReturnType<Range<DataType, DataTypeObject>> {
			if (argument.length !== 2) {
				this.setIssueForContext(
					context,
					argument.length > 2
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

			const [lower, upper] = argument,
				lowerValue = Object.safeFrom(lower as string),
				upperValue = Object.safeFrom(upper as string);

			if (!lowerValue.success) {
				this.setIssueForContext(context, lowerValue.error.issue);
				return INVALID;
			}

			if (!upperValue.success) {
				this.setIssueForContext(context, upperValue.error.issue);
				return INVALID;
			}

			if (greaterThan(lowerValue.data, upperValue.data)) {
				this.setIssueForContext(context, {
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
					values: [lowerValue.data, upperValue.data],
				})
			);
		}

		private _parseObject(context: ParseContext, argument: object, secondArgument: unknown): ParseReturnType<Range<DataType, DataTypeObject>> {
			const parsedType = getParsedType(secondArgument);

			if (context.data.length > 2) {
				this.setIssueForContext(context, {
					code: "too_big",
					type: "arguments",
					maximum: 2,
					inclusive: true,
				});
				return INVALID;
			}

			//Input should be [Range<DataType, DataTypeObject>]
			if (Range.isRange(argument)) {
				if (parsedType !== "undefined") {
					this.setIssueForContext(context, {
						code: "too_big",
						type: "arguments",
						maximum: 1,
						exact: true,
					});
					return INVALID;
				}

				return OK(
					new RangeClass({
						lower: argument.lower,
						upper: argument.upper,
						values: argument.values,
					})
				);
			}

			//Input should be [DataType, DataType]
			if (isObjectFunction(argument)) {
				if (parsedType === "undefined") {
					this.setIssueForContext(context, {
						code: "too_small",
						type: "arguments",
						minimum: 2,
						exact: true,
					});
					return INVALID;
				}

				const parsedObject = Object.safeFrom(secondArgument as string);
				if (!parsedObject.success) {
					this.setIssueForContext(context, parsedObject.error.issue);
					return INVALID;
				}

				if (greaterThan(argument, parsedObject.data)) {
					this.setIssueForContext(context, {
						code: "invalid_range_bound",
						lower: argument.toString(),
						upper: parsedObject.data.toString(),
					});
					return INVALID;
				}

				return OK(
					new RangeClass({
						lower: LowerRange.include,
						upper: UpperRange.exclude,
						values: [argument, parsedObject.data],
					})
				);
			}

			//Input should be [RangeObject<DataType> | RawRangeObject<DataTypeObject>]
			if (parsedType !== "undefined") {
				this.setIssueForContext(context, {
					code: "too_big",
					type: "arguments",
					maximum: 1,
					exact: true,
				});
				return INVALID;
			}

			const parsedObject = hasKeys<RawRangeObject<DataTypeObject> | RangeObject<DataType>>(argument, [
				["lower", "string"],
				["upper", "string"],
				["values", ["array", "null"]],
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

			const { lower, upper, values: value } = parsedObject.obj;

			if (!lowerRange.includes(lower)) {
				this.setIssueForContext(context, {
					code: "invalid_string",
					expected: lowerRange,
					received: lower,
				});
				return INVALID;
			}

			if (!upperRange.includes(upper)) {
				this.setIssueForContext(context, {
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
						values: value,
					})
				);
			}

			return this._parseArray(context, value, {
				lower,
				upper,
			});
		}

		isRange(object: any): object is Range<DataType, DataTypeObject> {
			//@ts-expect-error - This is a hack to get around the fact that the value is private
			return object instanceof RangeClass && object._identifier === identifier;
		}
	}

	const Range: RangeConstructor<DataType, DataTypeObject> = new RangeConstructorClass();

	class RangeClass extends PGTPRangeBase<Range<DataType, DataTypeObject>, DataType> implements Range<DataType, DataTypeObject> {
		private _identifier = identifier;
		private _lower: LowerRange | LowerRangeType;
		private _upper: UpperRange | UpperRangeType;
		private _values: [DataType, DataType] | null;
		constructor(data: RangeObject<DataType>) {
			super();

			this._lower = data.lower;
			this._upper = data.upper;
			this._values = data.values === null ? null : (data.values as [DataType, DataType]);

			this._checkEmpty();
		}

		private _checkEmpty() {
			if (
				this._values &&
				((this._lower === LowerRange.include && this._upper === UpperRange.exclude) ||
					(this._lower === LowerRange.exclude && this._upper === UpperRange.include)) &&
				this._values[0].equals(this._values[1])
			)
				this._values = null;
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
				if (this._values === null) {
					return OK({
						isWithinRange: false,
					});
				}

				return OK({
					isWithinRange:
						(this._lower === LowerRange.include ? greaterThanOrEqual(parsed.data, this._values[0]) : greaterThan(parsed.data, this._values[0])) &&
						(this._upper === UpperRange.include ? lessThanOrEqual(parsed.data, this._values[1]) : lessThan(parsed.data, this._values[1])),
					data: parsed.data,
				});
			}
			this.setIssueForContext(input, parsed.error.issue);
			return INVALID;
		}

		toString(): string {
			if (this._values === null) return "empty";
			return `${this._lower}${this._values[0].toString()},${this._values[1].toString()}${this._upper}`;
		}

		toJSON(): RawRangeObject<DataTypeObject> {
			return {
				lower: this._lower,
				upper: this._upper,
				values: (this._values?.map(v => v.toJSON()) as [DataTypeObject, DataTypeObject]) ?? null,
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

		get values(): [DataType, DataType] | null {
			return this._values;
		}

		set values(value: [DataType, DataType] | null) {
			if (value === null) {
				this._values = null;
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

			this._values = [lower.data, upper.data];
			this._checkEmpty();
		}

		get empty(): boolean {
			return this._values === null;
		}

		get value(): string {
			return this.toString();
		}

		set value(range: string) {
			const parsed = Range.safeFrom(range);
			if (parsed.success) {
				this._values = parsed.data.values;
				this._lower = parsed.data.lower;
				this._upper = parsed.data.upper;
			} else throw parsed.error;
		}
	}

	return Range;
};

export { getRange, LowerRange, LowerRangeType, Range, RangeConstructor, RangeObject, RawRangeObject, UpperRange, UpperRangeType };
