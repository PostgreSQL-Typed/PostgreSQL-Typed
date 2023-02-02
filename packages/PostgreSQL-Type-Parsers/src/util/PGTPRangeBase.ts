import type { ParseContext } from "../types/ParseContext";
import type { ParseReturnType } from "../types/ParseReturnType";
import type { SafeIsWithinRange } from "../types/SafeIsWithinRange";
import { getErrorMap } from "./errorMap";
import { PGTPBase } from "./PGTPBase";
import { PGTPError } from "./PGTPError";
import { isValid } from "./validation";

export abstract class PGTPRangeBase<RangeDataType, DataType> extends PGTPBase<RangeDataType> {
	constructor() {
		super();
		this.isWithinRange = this.isWithinRange.bind(this);
		this.safeIsWithinRange = this.safeIsWithinRange.bind(this);
	}

	abstract _isWithinRange(ctx: ParseContext): ParseReturnType<{
		readonly isWithinRange: boolean;
		readonly data?: DataType;
	}>;

	isWithinRange(...data: unknown[]): boolean {
		const result = this.safeIsWithinRange(...data);
		if (result.success) return result.isWithinRange;
		throw result.error;
	}

	safeIsWithinRange(...data: unknown[]): SafeIsWithinRange<DataType> {
		const ctx: ParseContext = {
				issue: null,
				errorMap: getErrorMap(),
				data,
			},
			result = this._isWithinRange(ctx);

		return this._handleWithinResult(ctx, result);
	}

	private _handleWithinResult(
		ctx: ParseContext,
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
		if (!ctx.issue) throw new Error("Validation failed but no issue detected.");
		const error = new PGTPError(ctx.issue);
		return { success: false, error };
	}
}
