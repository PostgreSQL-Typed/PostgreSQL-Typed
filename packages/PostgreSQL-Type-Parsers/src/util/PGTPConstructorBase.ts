import type { ParseContext } from "../types/ParseContext";
import type { ParseReturnType } from "../types/ParseReturnType";
import type { SafeFrom } from "../types/SafeFrom";
import { getErrorMap } from "./errorMap";
import { IssueWithoutMessage, PGTPError } from "./PGTPError";
import { isValid } from "./validation";

export abstract class PGTPConstructorBase<DataType> {
	constructor() {
		this.from = this.from.bind(this);
		this.safeFrom = this.safeFrom.bind(this);
	}

	abstract _parse(ctx: ParseContext): ParseReturnType<DataType>;

	from(...data: unknown[]): DataType {
		const result = this.safeFrom(...data);
		if (result.success) return result.data;
		throw result.error;
	}

	safeFrom(...data: unknown[]): SafeFrom<DataType> {
		const ctx: ParseContext = {
				issue: null,
				errorMap: getErrorMap(),
				data,
			},
			result = this._parse(ctx);

		return this._handleResult(ctx, result);
	}

	private _handleResult(ctx: ParseContext, result: ParseReturnType<DataType>): SafeFrom<DataType> {
		if (isValid(result)) return { success: true, data: result.value };
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
