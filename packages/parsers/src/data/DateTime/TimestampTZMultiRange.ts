/* eslint-disable unicorn/filename-case */
import { getMultiRange, MultiRange, MultiRangeConstructor, MultiRangeObject, RawMultiRangeObject } from "../../util/MultiRange.js";
import { TimestampTZ, TimestampTZObject } from "./TimestampTZ.js";
import { TimestampTZRange } from "./TimestampTZRange.js";

type TimestampTZMultiRangeObject = MultiRangeObject<TimestampTZ, TimestampTZObject>;

type RawTimestampTZMultiRangeObject = RawMultiRangeObject<TimestampTZObject>;

type TimestampTZMultiRange = MultiRange<TimestampTZ, TimestampTZObject>;

type TimestampTZMultiRangeConstructor = MultiRangeConstructor<TimestampTZ, TimestampTZObject>;

const TimestampTZMultiRange: TimestampTZMultiRangeConstructor = getMultiRange<TimestampTZ, TimestampTZObject>(
	TimestampTZRange,
	TimestampTZRange.isRange,
	"TimestampTZMultiRange"
);

export { RawTimestampTZMultiRangeObject, TimestampTZMultiRange, TimestampTZMultiRangeConstructor, TimestampTZMultiRangeObject };
