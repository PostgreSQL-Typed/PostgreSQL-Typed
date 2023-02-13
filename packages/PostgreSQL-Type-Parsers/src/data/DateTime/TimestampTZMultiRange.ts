/* eslint-disable unicorn/filename-case */
import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser.js";
import { getMultiRange, MultiRange, MultiRangeConstructor, MultiRangeObject, RawMultiRangeObject } from "../../util/MultiRange.js";
import { parser } from "../../util/parser.js";
import { TimestampTZ, TimestampTZObject } from "./TimestampTZ.js";
import { TimestampTZRange } from "./TimestampTZRange.js";

type TimestampTZMultiRangeObject = MultiRangeObject<TimestampTZ, TimestampTZObject>;

type RawTimestampTZMultiRangeObject = RawMultiRangeObject<TimestampTZObject>;

type TimestampTZMultiRange = MultiRange<TimestampTZ, TimestampTZObject>;

const TimestampTZMultiRange: MultiRangeConstructor<TimestampTZ, TimestampTZObject> = getMultiRange<TimestampTZ, TimestampTZObject>(
	TimestampTZRange,
	TimestampTZRange.isRange,
	"TimestampTZMultiRange"
);

types.setTypeParser(DataType.tstzmultirange as any, parser(TimestampTZMultiRange));
types.setTypeParser(DataType._tstzmultirange as any, arrayParser(TimestampTZMultiRange));

export { RawTimestampTZMultiRangeObject, TimestampTZMultiRange, TimestampTZMultiRangeObject };
