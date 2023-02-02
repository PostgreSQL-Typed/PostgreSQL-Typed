import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { getMultiRange, MultiRange, MultiRangeConstructor, MultiRangeObject, RawMultiRangeObject } from "../../util/MultiRange";
import { parser } from "../../util/parser";
import { Int4, Int4Object } from "./Int4";
import { Int4Range } from "./Int4Range";

type Int4MultiRangeObject = MultiRangeObject<Int4, Int4Object>;

type RawInt4MultiRangeObject = RawMultiRangeObject<Int4Object>;

type Int4MultiRange = MultiRange<Int4, Int4Object>;

const Int4MultiRange: MultiRangeConstructor<Int4, Int4Object> = getMultiRange<Int4, Int4Object>(Int4Range, Int4Range.isRange, "Int4MultiRange");

types.setTypeParser(DataType.int4multirange as any, parser(Int4MultiRange));
types.setTypeParser(DataType._int4multirange as any, arrayParser(Int4MultiRange));

export { Int4MultiRange, Int4MultiRangeObject, RawInt4MultiRangeObject };
