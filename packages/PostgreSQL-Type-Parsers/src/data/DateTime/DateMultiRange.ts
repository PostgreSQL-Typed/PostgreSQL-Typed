import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser.js";
import { getMultiRange, MultiRange, MultiRangeConstructor, MultiRangeObject, RawMultiRangeObject } from "../../util/MultiRange.js";
import { parser } from "../../util/parser.js";
import { Date, DateObject } from "./Date.js";
import { DateRange } from "./DateRange.js";

type DateMultiRangeObject = MultiRangeObject<Date, DateObject>;

type RawDateMultiRangeObject = RawMultiRangeObject<DateObject>;

type DateMultiRange = MultiRange<Date, DateObject>;

const DateMultiRange: MultiRangeConstructor<Date, DateObject> = getMultiRange<Date, DateObject>(DateRange, DateRange.isRange, "DateMultiRange");

types.setTypeParser(DataType.datemultirange as any, parser(DateMultiRange));
types.setTypeParser(DataType._datemultirange as any, arrayParser(DateMultiRange));

export { DateMultiRange, DateMultiRangeObject, RawDateMultiRangeObject };
