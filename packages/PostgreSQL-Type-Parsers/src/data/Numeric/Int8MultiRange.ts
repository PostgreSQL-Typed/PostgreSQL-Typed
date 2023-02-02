import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { getMultiRange, MultiRange, MultiRangeConstructor, MultiRangeObject, RawMultiRangeObject } from "../../util/MultiRange";
import { parser } from "../../util/parser";
import { Int8, Int8Object } from "./Int8";
import { Int8Range } from "./Int8Range";

type Int8MultiRangeObject = MultiRangeObject<Int8, Int8Object>;

type RawInt8MultiRangeObject = RawMultiRangeObject<Int8Object>;

type Int8MultiRange = MultiRange<Int8, Int8Object>;

const Int8MultiRange: MultiRangeConstructor<Int8, Int8Object> = getMultiRange<Int8, Int8Object>(Int8Range, Int8Range.isRange, "Int8MultiRange");

types.setTypeParser(DataType.int8multirange as any, parser(Int8MultiRange));
types.setTypeParser(DataType._int8multirange as any, arrayParser(Int8MultiRange));

export { Int8MultiRange, Int8MultiRangeObject, RawInt8MultiRangeObject };
