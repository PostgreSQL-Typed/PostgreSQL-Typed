import { Timestamp } from "../data/DateTime/Timestamp.js";
import { TimestampTZ } from "../data/DateTime/TimestampTZ.js";

export const greaterThanOrEqual = <
	DataType extends {
		toString(): string;
	},
>(
	value1: DataType,
	value2: DataType
) => {
	if ((Timestamp.isTimestamp(value1) && Timestamp.isTimestamp(value2)) || (TimestampTZ.isTimestampTZ(value1) && TimestampTZ.isTimestampTZ(value2)))
		return value1.toDateTime("utc").toMillis() >= value2.toDateTime("utc").toMillis();

	return value1.toString() >= value2.toString();
};
