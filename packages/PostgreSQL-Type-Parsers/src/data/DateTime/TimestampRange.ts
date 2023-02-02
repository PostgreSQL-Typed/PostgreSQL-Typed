import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";
import { getRange, Range, RangeConstructor, RangeObject, RawRangeObject } from "../../util/Range";
import { Timestamp, TimestampObject } from "./Timestamp";

type TimestampRangeObject = RangeObject<Timestamp>;

type RawTimestampRangeObject = RawRangeObject<TimestampObject>;

type TimestampRange = Range<Timestamp, TimestampObject>;

const TimestampRange: RangeConstructor<Timestamp, TimestampObject> = getRange<Timestamp, TimestampObject>(Timestamp, Timestamp.isTimestamp, "TimestampRange");

types.setTypeParser(DataType.tsrange as any, parser(TimestampRange));
types.setTypeParser(DataType._tsrange as any, arrayParser(TimestampRange));

export { RawTimestampRangeObject, TimestampRange, TimestampRangeObject };
