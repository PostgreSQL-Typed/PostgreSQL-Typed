import { OID } from "@postgresql-typed/oids";
import pg from "pg";
const { types } = pg;

import { arrayParser } from "../../util/arrayParser.js";
import { getMultiRange, MultiRange, MultiRangeConstructor, MultiRangeObject, RawMultiRangeObject } from "../../util/MultiRange.js";
import { parser } from "../../util/parser.js";
import { Int4, Int4Object } from "./Int4.js";
import { Int4Range } from "./Int4Range.js";

type Int4MultiRangeObject = MultiRangeObject<Int4, Int4Object>;

type RawInt4MultiRangeObject = RawMultiRangeObject<Int4Object>;

type Int4MultiRange = MultiRange<Int4, Int4Object>;

type Int4MultiRangeConstructor = MultiRangeConstructor<Int4, Int4Object>;

const Int4MultiRange: Int4MultiRangeConstructor = getMultiRange<Int4, Int4Object>(Int4Range, Int4Range.isRange, "Int4MultiRange");

types.setTypeParser(OID.int4multirange as any, parser(Int4MultiRange));
types.setTypeParser(OID._int4multirange as any, arrayParser(Int4MultiRange));

export { Int4MultiRange, Int4MultiRangeConstructor, Int4MultiRangeObject, RawInt4MultiRangeObject };
