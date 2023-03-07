import { OID } from "@postgresql-typed/oids";
import { types } from "pg";

import { arrayParser } from "../../util/arrayParser.js";
import { parser } from "../../util/parser.js";
import { getRange, Range, RangeConstructor, RangeObject, RawRangeObject } from "../../util/Range.js";
import { Date, DateObject } from "./Date.js";

type DateRangeObject = RangeObject<Date>;

type RawDateRangeObject = RawRangeObject<DateObject>;

type DateRange = Range<Date, DateObject>;

const DateRange: RangeConstructor<Date, DateObject> = getRange<Date, DateObject>(Date, Date.isDate, "DateRange");

types.setTypeParser(OID.daterange as any, parser(DateRange));
types.setTypeParser(OID._daterange as any, arrayParser(DateRange));

export { DateRange, DateRangeObject, RawDateRangeObject };
