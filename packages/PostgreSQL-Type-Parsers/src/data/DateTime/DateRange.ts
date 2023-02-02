import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";
import { getRange, Range, RangeConstructor, RangeObject, RawRangeObject } from "../../util/Range";
import { Date, DateObject } from "./Date";

type DateRangeObject = RangeObject<Date>;

type RawDateRangeObject = RawRangeObject<DateObject>;

type DateRange = Range<Date, DateObject>;

const DateRange: RangeConstructor<Date, DateObject> = getRange<Date, DateObject>(Date, Date.isDate, "DateRange");

types.setTypeParser(DataType.daterange as any, parser(DateRange));
types.setTypeParser(DataType._daterange as any, arrayParser(DateRange));

export { DateRange, DateRangeObject, RawDateRangeObject };
