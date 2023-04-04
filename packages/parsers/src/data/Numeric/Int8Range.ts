import { getRange, Range, RangeConstructor, RangeObject, RawRangeObject } from "../../util/Range.js";
import { Int8, Int8Object } from "./Int8.js";

type Int8RangeObject = RangeObject<Int8>;

type RawInt8RangeObject = RawRangeObject<Int8Object>;

type Int8Range = Range<Int8, Int8Object>;

type Int8RangeConstructor = RangeConstructor<Int8, Int8Object>;

const Int8Range: Int8RangeConstructor = getRange<Int8, Int8Object>(Int8, Int8.isInt8, "Int8Range");

export { Int8Range, Int8RangeConstructor, Int8RangeObject, RawInt8RangeObject };
