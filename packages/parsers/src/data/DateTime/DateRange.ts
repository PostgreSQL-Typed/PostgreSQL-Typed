import { getRange, Range, RangeConstructor, RangeObject, RawRangeObject } from "../../util/Range.js";
import { Date, DateObject } from "./Date.js";

type DateRangeObject = RangeObject<Date>;

type RawDateRangeObject = RawRangeObject<DateObject>;

type DateRange = Range<Date, DateObject>;

type DateRangeConstructor = RangeConstructor<Date, DateObject>;

const DateRange: DateRangeConstructor = getRange<Date, DateObject>(Date, Date.isDate, "DateRange");

export { DateRange, DateRangeConstructor, DateRangeObject, RawDateRangeObject };
