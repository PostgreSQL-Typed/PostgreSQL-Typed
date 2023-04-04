import { getMultiRange, MultiRange, MultiRangeConstructor, MultiRangeObject, RawMultiRangeObject } from "../../util/MultiRange.js";
import { Timestamp, TimestampObject } from "./Timestamp.js";
import { TimestampRange } from "./TimestampRange.js";

type TimestampMultiRangeObject = MultiRangeObject<Timestamp, TimestampObject>;

type RawTimestampMultiRangeObject = RawMultiRangeObject<TimestampObject>;

type TimestampMultiRange = MultiRange<Timestamp, TimestampObject>;

type TimestampMultiRangeConstructor = MultiRangeConstructor<Timestamp, TimestampObject>;

const TimestampMultiRange: TimestampMultiRangeConstructor = getMultiRange<Timestamp, TimestampObject>(
	TimestampRange,
	TimestampRange.isRange,
	"TimestampMultiRange"
);

export { RawTimestampMultiRangeObject, TimestampMultiRange, TimestampMultiRangeConstructor, TimestampMultiRangeObject };
