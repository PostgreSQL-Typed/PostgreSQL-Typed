import { joinValues, ParsedType } from "@postgresql-typed/util";

import { ErrorMap, IssueCode } from "../util/PgTPError.js";

const errorMap: ErrorMap = issue => {
	let message: string;
	switch (issue.code) {
		case IssueCode.invalid_type:
		case IssueCode.invalid_string:
			message =
				issue.received === ParsedType.undefined
					? "Required"
					: `Expected ${Array.isArray(issue.expected) ? joinValues(issue.expected, " | ") : `'${issue.expected}'`}, received '${issue.received}'`;

			break;
		case IssueCode.invalid_key_type:
			message =
				issue.received === ParsedType.undefined
					? `Required key "${issue.objectKey}"`
					: `Expected ${Array.isArray(issue.expected) ? joinValues(issue.expected, " | ") : `'${issue.expected}'`} for key '${issue.objectKey}', received '${
							issue.received
					  }'`;
			break;
		case IssueCode.invalid_timezone:
			message = `Could not recognize '${issue.received}' as a valid timezone`;
			break;
		case IssueCode.invalid_range_bound:
			message = `Range lower bound ('${issue.lower}') must be less than or equal to range upper bound ('${issue.upper}')`;
			break;
		case IssueCode.unrecognized_keys:
			message = `Unrecognized key${issue.keys.length > 1 ? "s" : ""} in object: ${joinValues(issue.keys)}`;
			break;
		case IssueCode.missing_keys:
			message = `Missing key${issue.keys.length > 1 ? "s" : ""} in object: ${joinValues(issue.keys)}`;
			break;
		case IssueCode.invalid_date:
			message = "Invalid globalThis.Date";
			break;
		case IssueCode.invalid_luxon_date:
			message = "Invalid luxon.DateTime";
			break;
		case IssueCode.invalid_json:
			message = "Invalid JSON";
			break;
		case IssueCode.too_small:
			switch (issue.type) {
				case "array":
					message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? "at least" : "more than"} ${issue.minimum} element(s)`;
					break;
				case "number":
					message = `Number must be ${issue.exact ? "exactly equal to" : issue.inclusive ? "greater than or equal to" : "greater than"} ${issue.minimum}`;
					break;
				case "bigint":
					message = `BigInt must be ${issue.exact ? "exactly equal to" : issue.inclusive ? "greater than or equal to" : "greater than"} ${issue.minimum}`;
					break;
				case "arguments":
					message = `Function must have ${issue.exact ? "exactly" : issue.inclusive ? "at least" : "more than"} ${issue.minimum} argument(s)`;
					break;
				default:
					message = "Invalid input";
					throw new Error(message);
			}
			break;
		case IssueCode.too_big:
			switch (issue.type) {
				case "array":
					message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? "at most" : "less than"} ${issue.maximum} element(s)`;
					break;
				case "number":
					message = `Number must be ${issue.exact ? "exactly" : issue.inclusive ? "less than or equal to" : "less than"} ${issue.maximum}`;
					break;
				case "bigint":
					message = `BigInt must be ${issue.exact ? "exactly" : issue.inclusive ? "less than or equal to" : "less than"} ${issue.maximum}`;
					break;
				case "arguments":
					message = `Function must have ${issue.exact ? "exactly" : issue.inclusive ? "at most" : "less than"} ${issue.maximum} argument(s)`;
					break;
				case "bytes":
					message = `String must be ${issue.exact ? "exactly" : issue.inclusive ? "at most" : "less than"} ${issue.maximum} byte(s) long`;
					break;
				default:
					message = "Invalid input";
					throw new Error(message);
			}
			break;
		case IssueCode.invalid_n_length:
			message = `Invalid 'n' length: ${issue.received}, 'n' must be less than or equal to ${issue.maximum}`;
			break;
		case IssueCode.not_finite:
			message = "Number must be finite";
			break;
		case IssueCode.not_whole:
			message = "Number must be whole";
			break;
		default:
			message = "Invalid IssueCode";
			throw new Error(message);
	}
	return { message };
};

export default errorMap;
