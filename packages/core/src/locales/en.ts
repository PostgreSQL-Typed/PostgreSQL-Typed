import { joinValues } from "@postgresql-typed/util";

import { type ErrorMap, IssueCode } from "../util/PGTError.js";

const errorMap: ErrorMap = issue => {
	let message: string;
	switch (issue.code) {
		case IssueCode.invalid_type:
			message = `Expected ${Array.isArray(issue.expected) ? joinValues(issue.expected, " | ") : `'${issue.expected}'`}, received '${issue.received}'`;

			break;
		case IssueCode.invalid_key_type:
			message = `Expected ${Array.isArray(issue.expected) ? joinValues(issue.expected, " | ") : `'${issue.expected}'`} for key '${
				issue.objectKey
			}', received '${issue.received}'`;
			break;
		case IssueCode.unrecognized_keys:
			message = `Unrecognized key${issue.keys.length > 1 ? "s" : ""} in object: ${joinValues(issue.keys)}`;
			break;
		case IssueCode.missing_keys:
			message = `Missing key${issue.keys.length > 1 ? "s" : ""} in object: ${joinValues(issue.keys)}`;
			break;
		case IssueCode.not_ready:
			message = "The client is not ready yet, please make sure you ran the 'testConnection' method before querying the database.";
			break;
		case IssueCode.too_small:
			switch (issue.type) {
				case "array":
					message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? "at least" : "more than"} ${issue.minimum} element(s)`;
					break;
				case "number":
					message = `Number must be ${issue.exact ? "exactly equal to" : issue.inclusive ? "greater than or equal to" : "greater than"} ${issue.minimum}`;
					break;
				case "arguments":
					message = `Function must have ${issue.exact ? "exactly" : issue.inclusive ? "at least" : "more than"} ${issue.minimum} argument(s)`;
					break;
				case "keys":
					message = `Object must have ${issue.exact ? "exactly" : issue.inclusive ? "at least" : "more than"} ${issue.minimum} key(s)`;
					break;
				/* c8 ignore next 4 */
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
				case "keys":
					message = `Object must have ${issue.exact ? "exactly" : issue.inclusive ? "at most" : "less than"} ${issue.maximum} key(s)`;
					break;
				case "arguments":
					message = `Function must have ${issue.exact ? "exactly" : issue.inclusive ? "at most" : "less than"} ${issue.maximum} argument(s)`;
					break;
				case "depth":
					message = `Object must have a depth of ${issue.exact ? "exactly" : issue.inclusive ? "at most" : "less than"} ${issue.maximum}`;
					break;
				/* c8 ignore next 4 */
				default:
					message = "Invalid input";
					throw new Error(message);
			}
			break;
		case IssueCode.query_error:
			message = `An error occurred while executing the query: ${issue.errorMessage}`;
			break;
		case IssueCode.invalid_string:
		case IssueCode.invalid_join_type:
			message = `Expected ${Array.isArray(issue.expected) ? joinValues(issue.expected, " | ") : `'${issue.expected}'`}${
				issue.code === IssueCode.invalid_join_type ? " as a join type" : ""
			}, received '${issue.received}'`;
			break;
		case IssueCode.invalid_join:
			switch (issue.type) {
				case "class":
					message = "Expected a class extending the 'Table' class";
					break;
				case "database":
					message = "Cannot join a table from a different database";
					break;
				case "duplicate":
					message = "Cannot join the same table twice";
					break;
				/* c8 ignore next 4 */
				default:
					message = "Invalid input";
					throw new Error(message);
			}
			break;
		/* c8 ignore next 4 */
		default:
			message = "Invalid IssueCode";
			throw new Error(message);
	}
	return { message };
};

export default errorMap;
