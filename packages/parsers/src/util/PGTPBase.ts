/* eslint-disable unicorn/filename-case */
import type { ParseContext } from "../types/ParseContext.js";
import type { ParseReturnType } from "../types/ParseReturnType.js";
import type { SafeEquals } from "../types/SafeEquals.js";
import { getErrorMap } from "./errorMap.js";
import { IssueWithoutMessage, PGTPError } from "./PGTPError.js";
import { isValid } from "./validation.js";

export abstract class PGTPBase<DataType> {
	constructor() {
		this.equals = this.equals.bind(this);
		this.safeEquals = this.safeEquals.bind(this);
	}

	abstract value: string | number | boolean;

	abstract _equals(context: ParseContext): ParseReturnType<{
		readonly equals: boolean;
		readonly data: DataType;
	}>;

	equals(...data: unknown[]): boolean {
		const result = this.safeEquals(...data);
		if (result.success) return result.equals;
		throw result.error;
	}

	safeEquals(...data: unknown[]): SafeEquals<DataType> {
		const context: ParseContext = {
				issue: null,
				errorMap: getErrorMap(),
				data,
			},
			result = this._equals(context);

		return this._handleResult(context, result);
	}

	private _handleResult(
		context: ParseContext,
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
		if (!context.issue) throw new Error("Validation failed but no issue detected.");
		const error = new PGTPError(context.issue);
		return { success: false, error };
	}

	setIssueForContext(context: ParseContext, issueData: IssueWithoutMessage): void {
		context.issue = {
			...issueData,
			message: context.errorMap(issueData).message,
		};
	}
}
