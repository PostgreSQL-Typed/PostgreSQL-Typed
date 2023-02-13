import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser.js";
import { getMultiRange, MultiRange, MultiRangeConstructor, MultiRangeObject, RawMultiRangeObject } from "../../util/MultiRange.js";
import { parser } from "../../util/parser.js";
import { Timestamp, TimestampObject } from "./Timestamp.js";
import { TimestampRange } from "./TimestampRange.js";

type TimestampMultiRangeObject = MultiRangeObject<Timestamp, TimestampObject>;

type RawTimestampMultiRangeObject = RawMultiRangeObject<TimestampObject>;

type TimestampMultiRange = MultiRange<Timestamp, TimestampObject>;

const TimestampMultiRange: MultiRangeConstructor<Timestamp, TimestampObject> = getMultiRange<Timestamp, TimestampObject>(
	TimestampRange,
	TimestampRange.isRange,
	"TimestampMultiRange"
);

types.setTypeParser(DataType.tsmultirange as any, parser(TimestampMultiRange));
types.setTypeParser(DataType._tsmultirange as any, arrayParser(TimestampMultiRange));

export { RawTimestampMultiRangeObject, TimestampMultiRange, TimestampMultiRangeObject };
