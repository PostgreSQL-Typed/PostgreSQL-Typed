import { getRange, Range, RangeConstructor, RangeObject, RawRangeObject } from "../../util/Range.js";
import { Timestamp, TimestampObject } from "./Timestamp.js";

type TimestampRangeObject = RangeObject<Timestamp>;

type RawTimestampRangeObject = RawRangeObject<TimestampObject>;

type TimestampRange = Range<Timestamp, TimestampObject>;

type TimestampRangeConstructor = RangeConstructor<Timestamp, TimestampObject>;

const TimestampRange: TimestampRangeConstructor = getRange<Timestamp, TimestampObject>(Timestamp, Timestamp.isTimestamp, "TimestampRange");

export { RawTimestampRangeObject, TimestampRange, TimestampRangeConstructor, TimestampRangeObject };
