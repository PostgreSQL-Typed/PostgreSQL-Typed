import { OID } from "@postgresql-typed/oids";
import { types } from "pg";

import { arrayParser } from "../../util/arrayParser.js";
import { parser } from "../../util/parser.js";
import { getRange, Range, RangeConstructor, RangeObject, RawRangeObject } from "../../util/Range.js";
import { Int8, Int8Object } from "./Int8.js";

type Int8RangeObject = RangeObject<Int8>;

type RawInt8RangeObject = RawRangeObject<Int8Object>;

type Int8Range = Range<Int8, Int8Object>;

const Int8Range: RangeConstructor<Int8, Int8Object> = getRange<Int8, Int8Object>(Int8, Int8.isInt8, "Int8Range");

types.setTypeParser(OID.int8range as any, parser(Int8Range));
types.setTypeParser(OID._int8range as any, arrayParser(Int8Range));

export { Int8Range, Int8RangeObject, RawInt8RangeObject };
