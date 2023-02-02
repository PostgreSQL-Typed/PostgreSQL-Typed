import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";
import { getRange, Range, RangeConstructor, RangeObject, RawRangeObject } from "../../util/Range";
import { Int8, Int8Object } from "./Int8";

type Int8RangeObject = RangeObject<Int8>;

type RawInt8RangeObject = RawRangeObject<Int8Object>;

type Int8Range = Range<Int8, Int8Object>;

const Int8Range: RangeConstructor<Int8, Int8Object> = getRange<Int8, Int8Object>(Int8, Int8.isInt8, "Int8Range");

types.setTypeParser(DataType.int8range as any, parser(Int8Range));
types.setTypeParser(DataType._int8range as any, arrayParser(Int8Range));

export { Int8Range, Int8RangeObject, RawInt8RangeObject };
