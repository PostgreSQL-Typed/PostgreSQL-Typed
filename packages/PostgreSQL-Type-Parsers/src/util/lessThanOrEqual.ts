import { Timestamp } from "../data/DateTime/Timestamp.js";
import { TimestampTZ } from "../data/DateTime/TimestampTZ.js";

export const lessThanOrEqual = <
	DataType extends {
		toString(): string;
	}
>(
	value1: DataType,
	value2: DataType
) => {
	if ((Timestamp.isTimestamp(value1) && Timestamp.isTimestamp(value2)) || (TimestampTZ.isTimestampTZ(value1) && TimestampTZ.isTimestampTZ(value2)))
		return value1.toDateTime("utc").toISO() <= value2.toDateTime("utc").toISO();

	return value1.toString() <= value2.toString();
};
