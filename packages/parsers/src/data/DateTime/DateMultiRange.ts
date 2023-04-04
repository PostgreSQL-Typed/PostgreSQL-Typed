import { getMultiRange, MultiRange, MultiRangeConstructor, MultiRangeObject, RawMultiRangeObject } from "../../util/MultiRange.js";
import { Date, DateObject } from "./Date.js";
import { DateRange } from "./DateRange.js";

type DateMultiRangeObject = MultiRangeObject<Date, DateObject>;

type RawDateMultiRangeObject = RawMultiRangeObject<DateObject>;

type DateMultiRange = MultiRange<Date, DateObject>;

type DateMultiRangeConstructor = MultiRangeConstructor<Date, DateObject>;

const DateMultiRange: DateMultiRangeConstructor = getMultiRange<Date, DateObject>(DateRange, DateRange.isRange, "DateMultiRange");

export { DateMultiRange, DateMultiRangeConstructor, DateMultiRangeObject, RawDateMultiRangeObject };
