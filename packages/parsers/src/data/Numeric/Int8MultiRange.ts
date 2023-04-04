import { getMultiRange, MultiRange, MultiRangeConstructor, MultiRangeObject, RawMultiRangeObject } from "../../util/MultiRange.js";
import { Int8, Int8Object } from "./Int8.js";
import { Int8Range } from "./Int8Range.js";

type Int8MultiRangeObject = MultiRangeObject<Int8, Int8Object>;

type RawInt8MultiRangeObject = RawMultiRangeObject<Int8Object>;

type Int8MultiRange = MultiRange<Int8, Int8Object>;

type Int8MultiRangeConstructor = MultiRangeConstructor<Int8, Int8Object>;

const Int8MultiRange: Int8MultiRangeConstructor = getMultiRange<Int8, Int8Object>(Int8Range, Int8Range.isRange, "Int8MultiRange");

export { Int8MultiRange, Int8MultiRangeConstructor, Int8MultiRangeObject, RawInt8MultiRangeObject };
