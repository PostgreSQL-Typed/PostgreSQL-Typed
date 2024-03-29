import { getRange, Range, RangeConstructor, RangeObject, RawRangeObject } from "../../util/Range.js";
import { Int4, Int4Object } from "./Int4.js";

type Int4RangeObject = RangeObject<Int4>;

type RawInt4RangeObject = RawRangeObject<Int4Object>;

type Int4Range = Range<Int4, Int4Object>;

type Int4RangeConstructor = RangeConstructor<Int4, Int4Object>;

const Int4Range: Int4RangeConstructor = getRange<Int4, Int4Object>(Int4, Int4.isInt4, "Int4Range");

export { Int4Range, Int4RangeConstructor, Int4RangeObject, RawInt4RangeObject };
