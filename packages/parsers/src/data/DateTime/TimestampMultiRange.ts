import { OID } from "@postgresql-typed/oids";
import { types } from "pg";

import { arrayParser } from "../../util/arrayParser.js";
import { getMultiRange, MultiRange, MultiRangeConstructor, MultiRangeObject, RawMultiRangeObject } from "../../util/MultiRange.js";
import { parser } from "../../util/parser.js";
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

types.setTypeParser(OID.tsmultirange as any, parser(TimestampMultiRange));
types.setTypeParser(OID._tsmultirange as any, arrayParser(TimestampMultiRange));

export { RawTimestampMultiRangeObject, TimestampMultiRange, TimestampMultiRangeConstructor, TimestampMultiRangeObject };
