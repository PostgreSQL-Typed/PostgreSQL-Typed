/* eslint-disable unicorn/filename-case */
import { getRange, Range, RangeConstructor, RangeObject, RawRangeObject } from "../../util/Range.js";
import { TimestampTZ, TimestampTZObject } from "./TimestampTZ.js";

type TimestampTZRangeObject = RangeObject<TimestampTZ>;

type RawTimestampTZRangeObject = RawRangeObject<TimestampTZObject>;

type TimestampTZRange = Range<TimestampTZ, TimestampTZObject>;

type TimestampTZRangeConstructor = RangeConstructor<TimestampTZ, TimestampTZObject>;

const TimestampTZRange: TimestampTZRangeConstructor = getRange<TimestampTZ, TimestampTZObject>(TimestampTZ, TimestampTZ.isTimestampTZ, "TimestampTZRange");

export { RawTimestampTZRangeObject, TimestampTZRange, TimestampTZRangeConstructor, TimestampTZRangeObject };
