/* eslint-disable unicorn/filename-case */
import { OID } from "@postgresql-typed/oids";
import pg from "pg";
const { types } = pg;

import { arrayParser } from "../../util/arrayParser.js";
import { parser } from "../../util/parser.js";
import { getRange, Range, RangeConstructor, RangeObject, RawRangeObject } from "../../util/Range.js";
import { TimestampTZ, TimestampTZObject } from "./TimestampTZ.js";

type TimestampTZRangeObject = RangeObject<TimestampTZ>;

type RawTimestampTZRangeObject = RawRangeObject<TimestampTZObject>;

type TimestampTZRange = Range<TimestampTZ, TimestampTZObject>;

type TimestampTZRangeConstructor = RangeConstructor<TimestampTZ, TimestampTZObject>;

const TimestampTZRange: TimestampTZRangeConstructor = getRange<TimestampTZ, TimestampTZObject>(TimestampTZ, TimestampTZ.isTimestampTZ, "TimestampTZRange");

types.setTypeParser(OID.tstzrange as any, parser(TimestampTZRange));
types.setTypeParser(OID._tstzrange as any, arrayParser(TimestampTZRange));

export { RawTimestampTZRangeObject, TimestampTZRange, TimestampTZRangeConstructor, TimestampTZRangeObject };
