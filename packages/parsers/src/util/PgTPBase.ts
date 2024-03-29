/* eslint-disable unicorn/filename-case */

import { isValid, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../types/ParseContext.js";
import type { SafeEquals } from "../types/SafeEquals.js";
import { getErrorMap } from "./errorMap.js";
import { IssueWithoutMessage, PgTPError } from "./PgTPError.js";

export abstract class PgTPBase<DataType> {
	constructor() {
		this.equals = this.equals.bind(this);
		this.safeEquals = this.safeEquals.bind(this);
	}

	abstract value: Record<string, unknown> | unknown[] | string | number | boolean | null | Buffer;
	abstract postgres: string;

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
				data,
				errorMap: getErrorMap(),
				issue: null,
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
				data: result.value.data,
				equals: result.value.equals,
				success: true,
			};
		}
		if (!context.issue) throw new Error("Validation failed but no issue detected.");
		const error = new PgTPError(context.issue);
		return { error, success: false };
	}

	setIssueForContext(context: ParseContext, issueData: IssueWithoutMessage): void {
		context.issue = {
			...issueData,
			message: context.errorMap(issueData).message,
		};
	}
}
