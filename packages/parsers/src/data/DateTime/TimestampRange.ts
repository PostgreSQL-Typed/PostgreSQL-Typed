import { OID } from "@postgresql-typed/oids";
import pg from "pg";
const { types } = pg;

import { arrayParser } from "../../util/arrayParser.js";
import { parser } from "../../util/parser.js";
import { getRange, Range, RangeConstructor, RangeObject, RawRangeObject } from "../../util/Range.js";
import { Timestamp, TimestampObject } from "./Timestamp.js";

type TimestampRangeObject = RangeObject<Timestamp>;

type RawTimestampRangeObject = RawRangeObject<TimestampObject>;

type TimestampRange = Range<Timestamp, TimestampObject>;

type TimestampRangeConstructor = RangeConstructor<Timestamp, TimestampObject>;

const TimestampRange: TimestampRangeConstructor = getRange<Timestamp, TimestampObject>(Timestamp, Timestamp.isTimestamp, "TimestampRange");

types.setTypeParser(OID.tsrange as any, parser(TimestampRange));
types.setTypeParser(OID._tsrange as any, arrayParser(TimestampRange));

export { RawTimestampRangeObject, TimestampRange, TimestampRangeConstructor, TimestampRangeObject };
