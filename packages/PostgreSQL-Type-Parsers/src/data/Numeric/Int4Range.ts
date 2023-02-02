import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";
import { getRange, Range, RangeConstructor, RangeObject, RawRangeObject } from "../../util/Range";
import { Int4, Int4Object } from "./Int4";

type Int4RangeObject = RangeObject<Int4>;

type RawInt4RangeObject = RawRangeObject<Int4Object>;

type Int4Range = Range<Int4, Int4Object>;

const Int4Range: RangeConstructor<Int4, Int4Object> = getRange<Int4, Int4Object>(Int4, Int4.isInt4, "Int4Range");

types.setTypeParser(DataType.int4range as any, parser(Int4Range));
types.setTypeParser(DataType._int4range as any, arrayParser(Int4Range));

export { Int4Range, Int4RangeObject, RawInt4RangeObject };
