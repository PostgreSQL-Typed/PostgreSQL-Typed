/* eslint-disable unicorn/filename-case */
import { isValid, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../types/ParseContext.js";
import type { SafeFrom } from "../types/SafeFrom.js";
import { getErrorMap } from "./errorMap.js";
import { IssueWithoutMessage, PGTPError } from "./PGTPError.js";

export abstract class PGTPConstructorBase<DataType> {
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
				issue: null,
				errorMap: getErrorMap(),
				data,
			},
			result = this._parse(context);

		return this._handleResult(context, result);
	}

	private _handleResult(context: ParseContext, result: ParseReturnType<DataType>): SafeFrom<DataType> {
		if (isValid(result)) return { success: true, data: result.value };
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
