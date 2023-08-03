/* eslint-disable unicorn/filename-case */
import { isValid, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../types/ParseContext.js";
import type { SafeFrom } from "../types/SafeFrom.js";
import { getErrorMap } from "./errorMap.js";
import { IssueWithoutMessage, PgTPError } from "./PgTPError.js";

export abstract class PgTPConstructorBase<DataType> {
	constructor() {
		this.from = this.from.bind(this);
		this.safeFrom = this.safeFrom.bind(this);
	}

	abstract _parse(context: ParseContext): ParseReturnType<DataType>;

	from(...data: unknown[]): DataType {
		const result = this.safeFrom(...data);
		if (result.success) return result.data;
		throw result.error;
	}

	safeFrom(...data: unknown[]): SafeFrom<DataType> {
		const context: ParseContext = {
				data,
				errorMap: getErrorMap(),
				issue: null,
			},
			result = this._parse(context);

		return this._handleResult(context, result);
	}

	private _handleResult(context: ParseContext, result: ParseReturnType<DataType>): SafeFrom<DataType> {
		if (isValid(result)) return { data: result.value, success: true };
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
