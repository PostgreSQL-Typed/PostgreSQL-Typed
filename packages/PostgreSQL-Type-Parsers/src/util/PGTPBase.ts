import type { ParseContext } from "../types/ParseContext";
import type { ParseReturnType } from "../types/ParseReturnType";
import type { SafeEquals } from "../types/SafeEquals";
import { getErrorMap } from "./errorMap";
import { IssueWithoutMessage, PGTPError } from "./PGTPError";
import { isValid } from "./validation";

export abstract class PGTPBase<DataType> {
	constructor() {
		this.equals = this.equals.bind(this);
		this.safeEquals = this.safeEquals.bind(this);
	}

	abstract _equals(ctx: ParseContext): ParseReturnType<{
		readonly equals: boolean;
		readonly data: DataType;
	}>;

	equals(...data: unknown[]): boolean {
		const result = this.safeEquals(...data);
		if (result.success) return result.equals;
		throw result.error;
	}

	safeEquals(...data: unknown[]): SafeEquals<DataType> {
		const ctx: ParseContext = {
				issue: null,
				errorMap: getErrorMap(),
				data,
			},
			result = this._equals(ctx);

		return this._handleResult(ctx, result);
	}

	private _handleResult(
		ctx: ParseContext,
		result: ParseReturnType<{
			readonly equals: boolean;
			readonly data: DataType;
		}>
	): SafeEquals<DataType> {
		if (isValid(result)) {
			return {
				success: true,
				equals: result.value.equals,
				data: result.value.data,
			};
		}
		if (!ctx.issue) throw new Error("Validation failed but no issue detected.");
		const error = new PGTPError(ctx.issue);
		return { success: false, error };
	}

	setIssueForContext(ctx: ParseContext, issueData: IssueWithoutMessage): void {
		ctx.issue = {
			...issueData,
			message: ctx.errorMap(issueData).message,
		};
	}
}
