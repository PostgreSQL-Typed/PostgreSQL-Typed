/* eslint-disable unicorn/filename-case */
import { OID } from "@postgresql-typed/oids";
import pg from "pg";
const { types } = pg;

import { arrayParser } from "../../util/arrayParser.js";
import { getMultiRange, MultiRange, MultiRangeConstructor, MultiRangeObject, RawMultiRangeObject } from "../../util/MultiRange.js";
import { parser } from "../../util/parser.js";
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

types.setTypeParser(OID.tstzmultirange as any, parser(TimestampTZMultiRange));
types.setTypeParser(OID._tstzmultirange as any, arrayParser(TimestampTZMultiRange));

export { RawTimestampTZMultiRangeObject, TimestampTZMultiRange, TimestampTZMultiRangeConstructor, TimestampTZMultiRangeObject };
