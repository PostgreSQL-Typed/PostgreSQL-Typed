/* eslint-disable unicorn/filename-case */
import { isValid, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../types/ParseContext.js";
import type { SafeIsWithinRange } from "../types/SafeIsWithinRange.js";
import { getErrorMap } from "./errorMap.js";
import { PgTPBase } from "./PgTPBase.js";
import { PGTPError } from "./PGTPError.js";

export abstract class PGTPRangeBase<RangeDataType, DataType> extends PgTPBase<RangeDataType> {
	constructor() {
		super();
		this.isWithinRange = this.isWithinRange.bind(this);
		this.safeIsWithinRange = this.safeIsWithinRange.bind(this);
	}

	abstract _isWithinRange(context: ParseContext): ParseReturnType<{
		readonly isWithinRange: boolean;
		readonly data?: DataType;
	}>;

	isWithinRange(...data: unknown[]): boolean {
		const result = this.safeIsWithinRange(...data);
		if (result.success) return result.isWithinRange;
		throw result.error;
	}

	safeIsWithinRange(...data: unknown[]): SafeIsWithinRange<DataType> {
		const context: ParseContext = {
				issue: null,
				errorMap: getErrorMap(),
				data,
			},
			result = this._isWithinRange(context);

		return this._handleWithinResult(context, result);
	}

	private _handleWithinResult(
		context: ParseContext,
		result: ParseReturnType<{
			readonly isWithinRange: boolean;
			readonly data?: DataType;
		}>
	): SafeIsWithinRange<DataType> {
		if (isValid(result)) {
			return {
				success: true,
				isWithinRange: result.value.isWithinRange,
				data: result.value.data,
			};
		}
		if (!context.issue) throw new Error("Validation failed but no issue detected.");
		const error = new PGTPError(context.issue);
		return { success: false, error };
	}
}
