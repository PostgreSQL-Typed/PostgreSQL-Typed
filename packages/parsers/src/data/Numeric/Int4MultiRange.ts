import { getMultiRange, MultiRange, MultiRangeConstructor, MultiRangeObject, RawMultiRangeObject } from "../../util/MultiRange.js";
import { Int4, Int4Object } from "./Int4.js";
import { Int4Range } from "./Int4Range.js";

type Int4MultiRangeObject = MultiRangeObject<Int4, Int4Object>;

type RawInt4MultiRangeObject = RawMultiRangeObject<Int4Object>;

type Int4MultiRange = MultiRange<Int4, Int4Object>;

type Int4MultiRangeConstructor = MultiRangeConstructor<Int4, Int4Object>;

const Int4MultiRange: Int4MultiRangeConstructor = getMultiRange<Int4, Int4Object>(Int4Range, Int4Range.isRange, "Int4MultiRange");

export { Int4MultiRange, Int4MultiRangeConstructor, Int4MultiRangeObject, RawInt4MultiRangeObject };
