# PostgreSQL-Type-Parsers [![Version](https://img.shields.io/npm/v/postgresql-type-parsers.svg)](https://www.npmjs.com/package/postgresql-type-parsers) [![CI](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/actions/workflows/CI.yml/badge.svg)](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/actions/workflows/CI.yml)

Easy to use types for PostgreSQL data types

- [Installation](#installation)
- [Usage](#usage)
  - [Date/Time Types](#datetime-types)
    - [Date](#date)
    - [DateMultiRange](#datemultirange)
    - [DateRange](#daterange)
    - [Interval](#interval)
    - [Time](#time)
    - [Timestamp](#timestamp)
    - [TimestampRange](#timestamprange)
    - [TimestampTZ](#timestamptz)
    - [TimestampTZRange](#timestamptzrange)
    - [TimeTZ](#timetz)
  - [Geometric Types](#geometric-types)
    - [Box](#box)
    - [Circle](#circle)
    - [Line](#line)
    - [LineSegment](#linesegment)
    - [Path](#path)
    - [Point](#point)
    - [Polygon](#polygon)
  - [Network Address Types](#network-address-types)
    - [IPAddress](#ipaddress)
    - [MACAddress](#macaddress)
    - [MACAddress8](#macaddress8)
  - [Numeric Types](#numeric-types)
    - [Int2](#int2)
    - [Int4](#int4)
    - [Int4MultiRange](#int4multirange)
    - [Int4Range](#int4range)
    - [Int8](#int8)
    - [Int8MultiRange](#int8multirange)
    - [Int8Range](#int8range)
  - [UUID Type](#uuid-type)
    - [UUID](#uuid)

## Installation

```bash
# npm
npm install postgresql-type-parsers

# yarn
yarn add postgresql-type-parsers

# pnpm
pnpm i postgresql-type-parsers
```

## Usage

## Date/Time Types

- [Date](#date)
- [DateMultiRange](#datemultirange)
- [DateRange](#daterange)
- [Interval](#interval)
- [Time](#time)
- [Timestamp](#timestamp)
- [TimestampRange](#timestamprange)
- [TimestampTZ](#timestamptz)
- [TimestampTZRange](#timestamptzrange)
- [TimeTZ](#timetz)

### Date

Used to represent the following PostgreSQL data type(s):

- [`date`][datetime]
- [`_date`][datetime] (`date[]`)

```ts
import { Date } from "postgresql-type-parsers";
import { DateTime } from "luxon";

//* Date can be created in the following ways:
const date1 = Date.from("2020-01-01");
const date2 = Date.from({ year: 2020, month: 1, day: 1 });
const date3 = Date.from(2020, 1, 1); //year, month, day
const date4 = Date.from(DateTime.fromISO("2020-01-01")); // Luxon DateTime
const date5 = Date.from(new globalThis.Date("2020-01-01")); // JavaScript Date

//* To verify if a value is a date, use the `isDate` method:
if (Date.isDate(date1)) {
  console.log("date1 is a date");
}

//* Afterwards, you can get/set the properties of the date:
date1.year; // 2020
date1.month; // 1
date1.day; // 1

//* It has a `toString()` method that returns a string representation of the date:
date1.toString(); // "2020-01-01"

//* It has a `toJSON()` method that returns a JSON representation of the date:
date1.toJSON(); // { year: 2020, month: 1, day: 1 }

//* It has a `equals()` method that returns whether two dates are equal:
date1.equals(date2); // true

//* It has a `toDateTime()` method that returns a `DateTime` representation of the date: (defaults to the current timezone)
date1.toDateTime(); // DateTime { year: 2020, month: 1, day: 1 }
date1.toDateTime("America/New_York"); // DateTime { year: 2020, month: 1, day: 1, zone: "America/New_York" }

//* It has a `toJSDate()` method that returns a JavaScript `Date` representation of the date: (defaults to the current timezone)
date1.toJSDate(); // Date { year: 2020, month: 1, day: 1 }
date1.toJSDate("America/New_York"); // Date { year: 2020, month: 1, day: 1, zone: "America/New_York" }
```

### DateMultiRange

Used to represent the following PostgreSQL data type(s):

- [`datemultirange`][multirange]
- [`_datemultirange`][multirange] (`datemultirange[]`)

```ts
import { DateMultiRange, DateRange } from "postgresql-type-parsers";

//* DateMultiRange can be created in the following ways:
const dateMultiRange1 = DateMultiRange.from(
  "{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01)}"
);
const dateMultiRange2 = DateMultiRange.from({
  ranges: [
    DateRange.from("[1999-01-08,2022-01-01)"),
    DateRange.from("[2023-01-08,2024-01-01)"),
  ],
});
const dateMultiRange3 = DateMultiRange.from([
  DateRange.from("[1999-01-08,2022-01-01)"),
  DateRange.from("[2023-01-08,2024-01-01)"),
]);
const dateMultiRange4 = DateMultiRange.from(
  DateRange.from("[1999-01-08,2022-01-01)"),
  DateRange.from("[2023-01-08,2024-01-01)")
);
const dateMultiRange5 = DateMultiRange.from({
  ranges: [
    {
      lower: LowerRange.include,
      upper: UpperRange.exclude,
      value: [
        { year: 1999, month: 1, day: 8 },
        { year: 2022, month: 1, day: 1 },
      ],
    },
    {
      lower: "(",
      upper: "]",
      value: [
        { year: 2023, month: 1, day: 8 },
        { year: 2024, month: 1, day: 1 },
      ],
    },
  ],
});

//* To verify if a value is a date multi range, use the `isMultiRange` method:
if (DateMultiRange.isMultiRange(dateMultiRange1)) {
  console.log("dateMultiRange1 is a date multi range");
}

//* Afterwards, you can get/set the properties of the date multi range:
dateMultiRange1.ranges; // [DateRange, DateRange]

//* It has a `toString()` method that returns a string representation of the date multi range:
dateMultiRange1.toString(); // "{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01)}"

//* It has a `toJSON()` method that returns a JSON representation of the date multi range:
dateMultiRange1.toJSON(); // { ranges: [{ lower: "[", upper: ")", value: [Date, Date] }, { lower: "[", upper: ")", value: [Date, Date] }] }

//* It has a `equals()` method that returns whether two date multi ranges are equal:
dateMultiRange1.equals(dateMultiRange2); // true
```

### DateRange

Used to represent the following PostgreSQL data type(s):

- [`daterange`][range]
- [`_daterange`][range] (`daterange[]`)

```ts
import {
  Date,
  DateRange,
  LowerRange,
  UpperRange,
} from "postgresql-type-parsers";

//* DateRange can be created in the following ways:
const dateRange1 = DateRange.from("[2022-09-02,2022-10-03)");
const dateRange2 = DateRange.from({
  lower: LowerRange.include,
  upper: UpperRange.exclude,
  value: [
    { year: 2022, month: 9, day: 2 }, // lowerValue
    { year: 2022, month: 10, day: 3 }, // upperValue
  ],
});
const dateRange3 = DateRange.from({
  lower: LowerRange.include,
  upper: UpperRange.exclude,
  value: [
    Date.from({ year: 2022, month: 9, day: 2 }), // lowerValue
    Date.from({ year: 2022, month: 10, day: 3 }), // upperValue
  ],
});
const dateRange4 = DateRange.from(
  Date.from({ year: 2022, month: 9, day: 2 }), // lowerValue
  Date.from({ year: 2022, month: 10, day: 3 }) // upperValue
); // Defaults to [lowerValue, upperValue)
const dateRange5 = DateRange.from([
  Date.from({ year: 2022, month: 9, day: 2 }), //lowerValue
  Date.from({ year: 2022, month: 10, day: 3 }), //upperValue
]); // Defaults to [lowerValue, upperValue)

//* To verify if a value is a date range, use the `isRange` method:
if (DateRange.isRange(dateRange1)) {
  console.log("dateRange1 is a date range");
}

//* Afterwards, you can get/set the properties of the date range:
dateRange1.lower; // LowerRange.include
dateRange1.upper; // UpperRange.exclude
dateRange1.value; // [Date { year: 2022, month: 9, day: 2 }, Date { year: 2022, month: 10, day: 3 }]

//* It has a `toString()` method that returns a string representation of the date range:
dateRange1.toString(); // "[2022-09-02,2022-10-03)"

//* It has a `toJSON()` method that returns a JSON representation of the date range:
dateRange1.toJSON(); // { lower: LowerRange.include, upper: UpperRange.exclude, value: [ { year: 2022, month: 9, day: 2 }, { year: 2022, month: 10, day: 3 } ] }

//* It has a `equals()` method that returns whether two date ranges are equal:
dateRange1.equals(dateRange2); // true

//* It has a `empty` readonly property that returns whether the date range is empty:
dateRange1.empty; // false
const dateRange6 = DateRange.from("[2022-09-02,2022-09-02)");
dateRange6.empty; // true
const dateRange7 = DateRange.from("empty");
dateRange7.empty; // true

//! Note that if a DateRange is empty, it will have a `null` value.
dateRange6.value; // null
dateRange7.value; // null

//* It has a `isWithinRange()` method that returns whether a date is within the range:
dateRange1.isWithinRange(Date.from("2022-09-15")); // true
```

### Interval

Used to represent the following PostgreSQL data type(s):

- [`interval`][interval]
- [`_interval`][interval] (`interval[]`)

```ts
import { Interval } from "postgresql-type-parsers";

//* Intervals can be created in the following ways:
const interval1 = Interval.from("01:02:03.456");
const interval2 = Interval.from("1 year -32 days");
const interval3 = Interval.from("P0Y0M4DT1H2M3S");
const interval4 = Interval.from("P4DT1H2M3S");
const interval5 = Interval.from(1, 2, 3, 4, 5, 6, 7); //years, months, days, hours, minutes, seconds, milliseconds
const interval6 = Interval.from({
  years: 1,
  months: 2,
  days: 3,
  hours: 4,
  minutes: 5,
  seconds: 6,
  milliseconds: 7,
});

//* To verify if a value is an interval, use the `isInterval` method:
if (Interval.isInterval(interval1)) {
  console.log("interval1 is an interval");
}

//* Afterwards, you can get/set the properties of the interval:
interval6.years; // 1
interval6.months; // 2
interval6.days; // 3
interval6.hours; // 4
interval6.minutes; // 5
interval6.seconds; // 6
interval6.milliseconds; // 7

//* There are also readonly properties for the interval's total values:
interval6.totalYears; // 1.1916765048546811
interval6.totalMonths; // 14.300118058256173
interval6.totalDays; // 429.0035417476852
interval6.totalHours; // 10296.085001944444
interval6.totalMinutes; // 617765.1001166666
interval6.totalSeconds; // 37065906.007
interval6.totalMilliseconds; // 37065906007

//* It has a `toString()` method that returns a string representation of the interval:
interval6.toString(); // "1 year 2 months 3 days 4 hours 5 minutes 6.007 seconds"

//* It has a `toISOString()` method that returns a JSON representation of the interval:
interval6.toISOString(); // "P1Y2M3DT4H5M6.007S"
//* By passing the `true` parameter, it will return the short representation of the interval:
interval1.toISOString(true); // "PT1H2M3.456S"

//* It has a `toJSON()` method that returns a JSON representation of the interval:
interval6.toJSON(); // { years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6, milliseconds: 7 }

//* It has a `equals()` method that returns whether two intervals are equal:
interval6.equals(interval5); // true
```

### Time

Used to represent the following PostgreSQL data type(s):

- [`time`][datetime]
- [`_time`][datetime] (`time[]`)

```ts
import { Time } from "postgresql-type-parsers";
import { DateTime } from "luxon";

//* Times can be created in the following ways:
const time1 = Time.from("12:34:56.789"); // Note milliseconds are ignored
const time2 = Time.from(12, 34, 56); // hours, minutes, seconds
const time3 = Time.from({
  hours: 12,
  minutes: 34,
  seconds: 56,
});
const time4 = Time.from(DateTime.fromISO("2020-01-01 12:34:56")); // Luxon DateTime
const time5 = Time.from(new globalThis.Date("2020-01-01 12:34:56")); // JavaScript Date

//* To verify if a value is a time, use the `isTime` method:
if (Time.isTime(time1)) {
  console.log("time1 is a time");
}

//* Afterwards, you can get/set the properties of the time:
time1.hours; // 12
time1.minutes; // 34
time1.seconds; // 56

//* It has a `toString()` method that returns a string representation of the time:
time1.toString(); // "12:34:56"

//* It has a `toJSON()` method that returns a JSON representation of the time:
time1.toJSON(); // { hours: 12, minutes: 34, seconds: 56 }

//* It has a `equals()` method that returns whether two times are equal:
time1.equals(time2); // true

//* It has a `toDateTime()` method that returns a `DateTime` representation of the date: (defaults to the current timezone)
time1.toDateTime(); // DateTime { hours: 12, minutes: 34, seconds: 56 }
time1.toDateTime("America/New_York"); // DateTime { hours: 12, minutes: 34, seconds: 56, zone: "America/New_York" }

//* It has a `toJSDate()` method that returns a JavaScript `Date` representation of the date: (defaults to the current timezone)
time1.toJSDate(); // Date { hours: 12, minutes: 34, seconds: 56 }
time1.toJSDate("America/New_York"); // Date { hours: 12, minutes: 34, seconds: 56, zone: "America/New_York" }
```

### Timestamp

Used to represent the following PostgreSQL data type(s):

- [`timestamp`][datetime]
- [`_timestamp`][datetime] (`timestamp[]`)

```ts
import { Timestamp } from "postgresql-type-parsers";
import { DateTime } from "luxon";

//* Timestamps can be created in the following ways:
const timestamp1 = Timestamp.from("2020-01-01 12:34:56.789");
const timestamp2 = Timestamp.from("2020-01-01T12:34:56.789Z"); // ISO8601
const timestamp3 = Timestamp.from(2020, 1, 1, 12, 34, 56.789); // year, month, day, hours, minutes, seconds
const timestamp4 = Timestamp.from({
  year: 2020,
  month: 1,
  day: 1,
  hours: 12,
  minutes: 34,
  seconds: 56.789,
});
const timestamp5 = Timestamp.from(DateTime.fromISO("2020-01-01T12:34:56.789Z")); // Luxon DateTime
const timestamp6 = Timestamp.from(
  new globalThis.Date("2020-01-01T12:34:56.789Z")
); // JavaScript Date

//* To verify if a value is a timestamp, use the `isTimestamp` method:
if (Timestamp.isTimestamp(timestamp1)) {
  console.log("timestamp1 is a timestamp");
}

//* Afterwards, you can get/set the properties of the timestamp:
timestamp1.year; // 2020
timestamp1.month; // 1
timestamp1.day; // 1
timestamp1.hours; // 12
timestamp1.minutes; // 34
timestamp1.seconds; // 56.789

//* It has a `toString()` method that returns a string representation of the timestamp:
timestamp1.toString(); // "2020-01-01 12:34:56.789"

//* It has a `toISO()` method that returns an ISO8601 representation of the timestamp:
timestamp1.toISO(); // "2020-01-01T12:34:56.789Z"

//* It has a `toJSON()` method that returns a JSON representation of the timestamp:
timestamp1.toJSON(); // { year: 2020, month: 1, day: 1, hours: 12, minutes: 34, seconds: 56.789 }

//* It has a `equals()` method that returns whether two timestamps are equal:
timestamp1.equals(timestamp2); // true

//* It has a `toDate()` method that returns a `Date` representation of the timestamp:
timestamp1.toDate(); // Date { year: 2020, month: 1, day: 1 }

//* It has a `toTime()` method that returns a `Time` representation of the timestamp:
timestamp1.toTime(); // Time { hours: 12, minutes: 34, seconds: 56 }

//* It has a `toDateTime()` method that returns a `DateTime` representation of the date: (defaults to the current timezone)
timestamp1.toDateTime(); // DateTime { year: 2020, month: 1, day: 1, hours: 12, minutes: 34, seconds: 56.789 }

//* It has a `toJSDate()` method that returns a JavaScript `Date` representation of the date: (defaults to the current timezone)
timestamp1.toJSDate(); // Date { year: 2020, month: 1, day: 1, hours: 12, minutes: 34, seconds: 56.789 }
```

### TimestampRange

Used to represent the following PostgreSQL data type(s):

- [`tsrange`][range]
- [`_tsrange`][range] (`tsrange[]`)

```ts
import {
  Timestamp,
  TimestampRange,
  LowerRange,
  UpperRange,
} from "postgresql-type-parsers";

//* TimestampRange can be created in the following ways:
const timestampRange1 = TimestampRange.from(
  "[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)"
);
const timestampRange2 = TimestampRange.from({
  lower: LowerRange.include,
  upper: UpperRange.exclude,
  value: [
    {
      year: 2004,
      month: 10,
      day: 19,
      hour: 10,
      minute: 23,
      second: 54.678,
    }, // lowerValue
    {
      year: 2004,
      month: 11,
      day: 19,
      hour: 10,
      minute: 23,
      second: 54.678,
    }, // upperValue
  ],
});
const timestampRange3 = TimestampRange.from({
  lower: LowerRange.include,
  upper: UpperRange.exclude,
  value: [
    Timestamp.from("2004-10-19T10:23:54.678Z"), // lowerValue
    Timestamp.from("2004-11-19T10:23:54.678Z"), // upperValue
  ],
});
const timestampRange4 = TimestampRange.from(
  Timestamp.from("2004-10-19T10:23:54.678Z"), // lowerValue
  Timestamp.from("2004-11-19T10:23:54.678Z") // upperValue
); // Defaults to [lowerValue, upperValue)
const timestampRange5 = TimestampRange.from([
  Timestamp.from("2004-10-19T10:23:54.678Z"), // lowerValue
  Timestamp.from("2004-11-19T10:23:54.678Z"), // upperValue
]); // Defaults to [lowerValue, upperValue)

//* To verify if a value is a timestamp range, use the `isRange` method:
if (TimestampRange.isRange(timestampRange1)) {
  console.log("timestampRange1 is a timestamp range");
}

//* Afterwards, you can get/set the properties of the timestamp range:
timestampRange1.lower; // LowerRange.include
timestampRange1.upper; // UpperRange.exclude
timestampRange1.value; // [Timestamp, Timestamp]

//* It has a `toString()` method that returns a string representation of the timestamp range:
timestampRange1.toString(); // "[2004-10-19 10:23:54.678,2004-11-19 10:23:54.678)"

//* It has a `toJSON()` method that returns a JSON representation of the timestamp range:
timestampRange1.toJSON(); // { lower: LowerRange.include, upper: UpperRange.exclude, value: [Timestamp, Timestamp] }

//* It has a `equals()` method that returns whether two timestamp ranges are equal:
timestampRange1.equals(timestampRange2); // true

//* It has a `empty` readonly property that returns whether the timestamp range is empty:
timestampRange1.empty; // false
const timestampRange6 = TimestampRange.from(
  "[2004-10-19T10:23:54.678Z,2004-10-19T10:23:54.678Z)"
);
timestampRange6.empty; // true
const timestampRange7 = TimestampRange.from("empty");
timestampRange7.empty; // true

//! Note that if a TimestampRange is empty, it will have a `null` value.
timestampRange6.value; // null
timestampRange7.value; // null

//* It has a `isWithinRange()` method that returns whether a timestamp is within the range:
timestampRange1.isWithinRange(Timestamp.from("2004-10-25T01:45:21.321Z")); // true
```

### TimestampTZ

Used to represent the following PostgreSQL data type(s):

- [`timestamptz`][datetime]
- [`_timestamptz`][datetime] (`timestamptz[]`)

```ts
import { TimestampTZ } from "postgresql-type-parsers";
import { DateTime } from "luxon";

//* TimestampTZs can be created in the following ways:
const timestampTZ1 = TimestampTZ.from("2020-01-01 12:34:56.789 +01:00");
const timestampTZ2 = TimestampTZ.from("2020-01-01T12:34:56.789+01:00"); // ISO8601
const timestampTZ3 = TimestampTZ.from(2020, 1, 1, 12, 34, 56.789, 1, 0, "plus"); // year, month, day, hours, minutes, seconds, offsetHours, offsetMinutes, offsetDirection
const timestampTZ4 = TimestampTZ.from({
  year: 2020,
  month: 1,
  day: 1,
  hours: 12,
  minutes: 34,
  seconds: 56.789,
  offset: {
    hours: 1,
    minutes: 0,
    direction: "plus",
  },
});
const timestampTZ5 = TimestampTZ.from(
  DateTime.fromISO("2020-01-01T12:34:56.789Z")
); // Luxon DateTime
const timestampTZ6 = TimestampTZ.from(
  new globalThis.Date("2020-01-01T12:34:56.789Z")
); // JavaScript Date

//* To verify if a value is a timestampTZ, use the `isTimestampTZ` method:
if (TimestampTZ.isTimestampTZ(timestampTZ1)) {
  console.log("timestampTZ1 is a timestampTZ");
}

//* Afterwards, you can get/set the properties of the timestampTZ:
timestampTZ1.year; // 2020
timestampTZ1.month; // 1
timestampTZ1.day; // 1
timestampTZ1.hours; // 12
timestampTZ1.minutes; // 34
timestampTZ1.seconds; // 56.789
timestampTZ1.offset.hours; // 1
timestampTZ1.offset.minutes; // 0
timestampTZ1.offset.direction; // "plus"

//* It has a `toString()` method that returns a string representation of the timestampTZ:
timestampTZ1.toString(); // "2020-01-01 12:34:56.789 +01:00"

//* It has a `toISO()` method that returns an ISO8601 representation of the timestampTZ:
timestampTZ1.toISO(); // "2020-01-01T12:34:56.789+01:00"

//* It has a `toJSON()` method that returns a JSON representation of the timestampTZ:
timestampTZ1.toJSON(); // { year: 2020, month: 1, day: 1, hours: 12, minutes: 34, seconds: 56.789, offset: { hours: 1, minutes: 0, direction: "plus" } }

//* It has a `equals()` method that returns whether two timestampTZs are equal:
timestampTZ1.equals(timestampTZ2); // true
// Note: When passing a TimestampTZ to the `equals` method, the offset of both TimestampTZs are converted to UTC before comparing.
// If you don't want this behavior, pass the TimestampTZ as a string or object to the `equals` method.

//* It has a `toDate()` method that returns a `Date` representation of the timestampTZ:
timestampTZ1.toDate(); // Date { year: 2020, month: 1, day: 1 }

//* It has a `toTimeTZ()` method that returns a `TimeTZ` representation of the timestampTZ:
timestampTZ1.toTimeTZ(); // TimeTZ { hours: 12, minutes: 34, seconds: 56.789, offset: { hours: 1, minutes: 0, direction: "plus" } }

//* It has a `toDateTime()` method that returns a `DateTime` representation of the timestampTZ:
timestampTZ1.toDateTime(); // DateTime { year: 2020, month: 1, day: 1, hours: 12, minutes: 34, seconds: 56.789, zone: "+01:00" }

//* It has a `toJSDate()` method that returns a JavaScript `Date` representation of the timestampTZ:
timestampTZ1.toJSDate(); // Date { year: 2020, month: 1, day: 1, hours: 12, minutes: 34, seconds: 56.789, zone: "+01:00" }
```

### TimestampTZRange

Used to represent the following PostgreSQL data type(s):

- [`tstzrange`][range]
- [`_tstzrange`][range] (`tstzrange[]`)

```ts
import {
  TimestampTZ,
  TimestampTZRange,
  LowerRange,
  UpperRange,
} from "postgresql-type-parsers";

//* TimestampTZRange can be created in the following ways:
const timestamptzRange1 = TimestampTZRange.from(
  "[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)"
);
const timestamptzRange2 = TimestampTZRange.from({
  lower: LowerRange.include,
  upper: UpperRange.exclude,
  value: [
    {
      year: 2004,
      month: 10,
      day: 19,
      hour: 4,
      minute: 5,
      second: 6.789,
      offset: {
        hour: 1,
        minute: 0,
        direction: "plus",
      },
    }, // lowerValue
    {
      year: 2004,
      month: 11,
      day: 19,
      hour: 4,
      minute: 5,
      second: 6.789,
      offset: {
        hour: 1,
        minute: 0,
        direction: "plus",
      },
    }, // upperValue
  ],
});
const timestamptzRange3 = TimestampTZRange.from({
  lower: LowerRange.include,
  upper: UpperRange.exclude,
  value: [
    TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"), // lowerValue
    TimestampTZ.from("2004-11-19 04:05:06.789 +01:00"), // upperValue
  ],
});
const timestamptzRange4 = TimestampTZRange.from(
  TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"), // lowerValue
  TimestampTZ.from("2004-11-19 04:05:06.789 +01:00") // upperValue
); // Defaults to [lowerValue, upperValue)
const timestamptzRange5 = TimestampTZRange.from([
  TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"), // lowerValue
  TimestampTZ.from("2004-11-19 04:05:06.789 +01:00"), // upperValue
]); // Defaults to [lowerValue, upperValue)

//* To verify if a value is a timestamp range, use the `isRange` method:
if (TimestampTZRange.isRange(timestamptzRange1)) {
  console.log("timestamptzRange1 is a timestamp range");
}

//* Afterwards, you can get/set the properties of the timestamp range:
timestamptzRange1.lower; // LowerRange.include
timestamptzRange1.upper; // UpperRange.exclude
timestamptzRange1.value; // [Timestamp, Timestamp]

//* It has a `toString()` method that returns a string representation of the timestamp range:
timestamptzRange1.toString(); // "[2004-10-19 10:23:54.678,2004-11-19 10:23:54.678)"

//* It has a `toJSON()` method that returns a JSON representation of the timestamp range:
timestamptzRange1.toJSON(); // { lower: LowerRange.include, upper: UpperRange.exclude, value: [Timestamp, Timestamp] }

//* It has a `equals()` method that returns whether two timestamp ranges are equal:
timestamptzRange1.equals(timestamptzRange2); // true

//* It has a `empty` readonly property that returns whether the timestamp range is empty:
timestamptzRange1.empty; // false
const timestamptzRange6 = TimestampTZRange.from(
  "[2004-10-19 04:05:06.789 +01:00,2004-10-19 04:05:06.789 +01:00)"
);
timestamptzRange6.empty; // true
const timestamptzRange7 = TimestampTZRange.from("empty");
timestamptzRange7.empty; // true

//! Note that if a TimestampTZRange is empty, it will have a `null` value.
timestamptzRange6.value; // null
timestamptzRange7.value; // null

//* It has a `isWithinRange()` method that returns whether a timestamp is within the range:
timestamptzRange1.isWithinRange(
  TimestampTZ.from("2004-10-25 01:45:21.321 +01:00")
); // true
```

### TimeTZ

Used to represent the following PostgreSQL data type(s):

- [`timetz`][datetime]
- [`_timetz`][datetime] (`timetz[]`)

```ts
import { TimeTZ, OffsetDirection } from "postgresql-type-parsers";
import { DateTime } from "luxon";

//* TimeTZs can be created in the following ways:
const timeTZ1 = TimeTZ.from("12:34:56.789-05:00");
const timeTZ2 = TimeTZ.from(12, 34, 56.789, 5, 0, OffsetDirection.minus); // hours, minutes, seconds, offsetHours, offsetMinutes, direction
const timeTZ3 = TimeTZ.from({
	hours: 12,
	minutes: 34,
	seconds: 56.789,
	offset: {
		hours: 5,
		minutes: 0
		direction: "minus"
	}
});
const timeTZ4 = TimeTZ.from(DateTime.fromISO("2020-01-01T12:34:56.789-05:00")); // Luxon DateTime
const timeTZ5 = TimeTZ.from(new globalThis.Date("2020-01-01T12:34:56.789-05:00")); // JavaScript Date
const timeTZ6 = TimeTZ.from("12:34:56.789 America/Jamaica"); // Using IANA timezone
const timeTZ7 = TimeTZ.from("12:34:56.789 EST"); // Using IANA timezone abbreviation

//* To verify if a value is a timeTZ, use the `isTimeTZ` method:
if (TimeTZ.isTimeTZ(timeTZ1)) {
	console.log("timeTZ1 is a timeTZ");
}

//* Afterwards, you can get/set the properties of the timeTZ:
timeTZ1.hours; // 12
timeTZ1.minutes; // 34
timeTZ1.seconds; // 56.789
timeTZ1.offset.hours; // 5
timeTZ1.offset.minutes; // 0
timeTZ1.offset.direction; // "minus"

//* It has a `toString()` method that returns a string representation of the timeTZ:
timeTZ1.toString(); // "12:34:56.789-05:00"

//* It has a `toJSON()` method that returns a JSON representation of the timeTZ:
timeTZ1.toJSON(); // { hours: 12, minutes: 34, seconds: 56.789, offset: { hours: 5, minutes: 0, direction: "minus" } }

//* It has a `equals()` method that returns whether two timeTZs are equal:
timeTZ1.equals(timeTZ2); // true
// Note: When passing a TimeTZ to the `equals` method, the offset of both TimeTZs are converted to UTC before comparing.
// If you don't want this behavior, pass the TimeTZ as a string or object to the `equals` method.

//* It has a `toDateTime()` method that returns a `DateTime` representation of the date: (defaults to the current timezone)
timeTZ1.toDateTime(); // DateTime { hours: 12, minutes: 34, seconds: 56.789, zone: "EST" }

//* It has a `toJSDate()` method that returns a JavaScript `Date` representation of the date: (defaults to the current timezone)
timeTZ1.toJSDate(); // Date { hours: 12, minutes: 34, seconds: 56.789, zone: "EST" }
```

## Geometric Types

- [Box](#box)
- [Circle](#circle)
- [Line](#line)
- [LineSegment](#linesegment)
- [Path](#path)
- [Point](#point)
- [Polygon](#polygon)

### Box

Used to represent the following PostgreSQL data type(s):

- [`box`][box]
- [`_box`][box] (`box[]`)

```ts
import { Box } from "postgresql-type-parsers";

//* Box can be created in the following ways:
const box1 = Box.from("(1,2),(3,4)");
const box2 = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
const box3 = Box.from(1, 2, 3, 4);

//* To verify if a value is a box, use the `isBox` method:
if (Box.isBox(box1)) {
  console.log("box1 is a box");
}

//* Afterwards, you can get/set the properties of the box:
box1.x1; // 1
box1.y1; // 2
box1.x2; // 3
box1.y2; // 4

//* It has a `toString()` method that returns a string representation of the box:
box1.toString(); // "(1,2),(3,4)"

//* It has a `toJSON()` method that returns a JSON representation of the box:
box1.toJSON(); // { x1: 1, y1: 2, x2: 3, y2: 4 }

//* It has a `equals()` method that returns whether two boxes are equal:
box1.equals(box2); // true
```

### Circle

Used to represent the following PostgreSQL data type(s):

- [`circle`][circle]
- [`_circle`][circle] (`circle[]`)

```ts
import { Circle } from "postgresql-type-parsers";

//* Circles can be created in the following ways:
const circle1 = Circle.from({ x: 1, y: 2, radius: 3 });
const circle2 = Circle.from("<(1,2),3>");
const circle3 = Circle.from(1, 2, 3); //x, y, radius

//* To verify if a value is a circle, use the `isCircle` method:
if (Circle.isCircle(circle1)) {
  console.log("circle1 is a circle");
}

//* Afterwards, you can get/set the properties of the circle:
circle1.x; // 1
circle1.y; // 2
circle1.radius; // 3

//* It has a `toString()` method that returns a string representation of the circle:
circle1.toString(); // "<(1,2),3>"

//* It has a `toJSON()` method that returns a JSON representation of the circle:
circle1.toJSON(); // { x: 1, y: 2, radius: 3 }

//* It has a `equals()` method that returns whether two circles are equal:
circle1.equals(circle2); // true
```

### Line

Used to represent the following PostgreSQL data type(s):

- [`line`][line]
- [`_line`][line] (`line[]`)

```ts
import { Line } from "postgresql-type-parsers";

//* Lines can be created in the following ways:
const line1 = Line.from({ a: 1, b: 2, c: 3 });
const line2 = Line.from("{1,2,3}");
const line3 = Line.from(1, 2, 3); //a, b, c

//* To verify if a value is a line, use the `isLine` method:
if (Line.isLine(line1)) {
  console.log("line1 is a line");
}

//* Afterwards, you can get/set the properties of the line:
line1.a; // 1
line1.b; // 2
line1.c; // 3

//* It has a `toString()` method that returns a string representation of the line:
line1.toString(); // "{1,2,3}"

//* It has a `toJSON()` method that returns a JSON representation of the line:
line1.toJSON(); // { a: 1, b: 2, c: 3 }

//* It has a `equals()` method that returns whether two lines are equal:
line1.equals(line2); // true
```

### LineSegment

Used to represent the following PostgreSQL data type(s):

- [`lseg`][lseg]
- [`_lseg`][lseg] (`lseg[]`)

```ts
import { LineSegment, Point } from "postgresql-type-parsers";

//* LineSegment can be created in the following ways:
const lineSegment1 = LineSegment.from("[(1,2),(3,4)]");
const lineSegment2 = LineSegment.from({
  a: Point.from(1, 2),
  b: Point.from(3, 4),
});
const lineSegment3 = LineSegment.from({
  a: {
    x: 1,
    y: 2,
  },
  b: {
    x: 3,
    y: 4,
  },
});
const lineSegment4 = LineSegment.from(Point.from(1, 2), Point.from(3, 4));

//* To verify if a value is a line segment, use the `isLineSegment` method:
if (LineSegment.isLineSegment(lineSegment1)) {
  console.log("lineSegment1 is a line segment");
}

//* Afterwards, you can get/set the properties of the line segment:
lineSegment1.a; // Point { x: 1, y: 2 }
lineSegment1.b; // Point { x: 3, y: 4 }

//* It has a `toString()` method that returns a string representation of the line segment:
lineSegment1.toString(); // "[(1,2),(3,4)]"

//* It has a `toJSON()` method that returns a JSON representation of the line segment:
lineSegment1.toJSON(); // { a: { x: 1, y: 2 }, b: { x: 3, y: 4 } }

//* It has a `equals()` method that returns whether two line segments are equal:
lineSegment1.equals(lineSegment2); // true
```

### Path

Used to represent the following PostgreSQL data type(s):

- [`path`][path]
- [`_path`][path] (`path[]`)

```ts
import { Path, Point } from "postgresql-type-parsers";

//* Path can be created in the following ways:
const path1 = Path.from("((1,2),(3,4))");
const path2 = Path.from([Point.from(1, 2), Point.from(3, 4)]); //Defaults connection to `open`
const path3 = Path.from({
  points: [
    { x: 1, y: 2 },
    { x: 3, y: 4 },
  ],
  connection: "closed",
});
const path4 = Path.from(Point.from(1, 2), Point.from(3, 4)); //Defaults connection to `open`
const path5 = Path.from({
  points: [Point.from(1, 2), Point.from(3, 4)],
  connection: "closed",
});

//* To verify if a value is a path, use the `isPath` method:
if (Path.isPath(path1)) {
  console.log("path1 is a path");
}

//* Afterwards, you can get/set the properties of the path:
path1.points; // [ Point { x: 1, y: 2 }, Point { x: 3, y: 4 } ]
path1.connection; // "open"

//* It has a `toString()` method that returns a string representation of the polygon:
path1.toString(); // "((1,2),(3,4))"

//* It has a `toJSON()` method that returns a JSON representation of the polygon:
path1.toJSON(); // { points: [ { x: 1, y: 2 }, { x: 3, y: 4 } ], connection: "open" }

//* It has a `equals()` method that returns whether two polygons are equal:
path1.equals(path2); // true
```

### Point

Used to represent the following PostgreSQL data type(s):

- [`point`][point]
- [`_point`][point] (`point[]`)

```ts
import { Point } from "postgresql-type-parsers";

//* Points can be created in the following ways:
const point1 = Point.from("(1,2)");
const point2 = Point.from({ x: 1, y: 2 });
const point3 = Point.from(1, 2);

//* To verify if a value is a point, use the `isPoint` method:
if (Point.isPoint(point1)) {
  console.log("point1 is a point");
}

//* Afterwards, you can get/set the properties of the point:
point1.x; // 1
point1.y; // 2

//* It has a `toString()` method that returns a string representation of the point:
point1.toString(); // "(1,2)"

//* It has a `toJSON()` method that returns a JSON representation of the point:
point1.toJSON(); // { x: 1, y: 2 }

//* It has a `equals()` method that returns whether two points are equal:
point1.equals(point2); // true
```

### Polygon

Used to represent the following PostgreSQL data type(s):

- [`polygon`][polygon]
- [`_polygon`][polygon] (`polygon[]`)

```ts
import { Polygon, Point } from "postgresql-type-parsers";

//* Polygons can be created in the following ways:
const polygon1 = Polygon.from("((1,2),(3,4))");
const polygon2 = Polygon.from([Point.from(1, 2), Point.from(3, 4)]);
const polygon3 = Polygon.from({
  points: [
    { x: 1, y: 2 },
    { x: 3, y: 4 },
  ],
});
const polygon4 = Polygon.from(Point.from(1, 2), Point.from(3, 4));
const polygon5 = Polygon.from({
  points: [Point.from(1, 2), Point.from(3, 4)],
});

//* To verify if a value is a polygon, use the `isPolygon` method:
if (Polygon.isPolygon(polygon1)) {
  console.log("polygon1 is a polygon");
}

//* Afterwards, you can get/set the properties of the polygon:
polygon1.points; // [ Point { x: 1, y: 2 }, Point { x: 3, y: 4 } ]

//* It has a `toString()` method that returns a string representation of the polygon:
polygon1.toString(); // "((1,2),(3,4))"

//* It has a `toJSON()` method that returns a JSON representation of the polygon:
polygon1.toJSON(); // { points: [ { x: 1, y: 2 }, { x: 3, y: 4 } ] }

//* It has a `equals()` method that returns whether two polygons are equal:
polygon1.equals(polygon2); // true
```

## Network Address Types

- [IPAddress](#ipaddress)
- [MACAddress](#macaddress)
- [MACAddress8](#macaddress8)

### IPAddress

Used to represent the following PostgreSQL data type(s):

- [`inet`][inet]
- [`_inet`][inet] (`inet[]`)
- [`cidr`][cidr]
- [`_cidr`][cidr] (`cidr[]`)

```ts
import { IPAddress } from "postgresql-type-parsers";
import { Address4, Address6 } from "ip-address";

//* IP addresses can be created in the following ways:
const ipAddress1 = IPAddress.from("192.168.100.128/25");
const ipAddress2 = IPAddress.from("192.168.100.128");
const ipAddress3 = IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64");
const ipAddress4 = IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348");
const ipAddress5 = IPAddress.from({
  IPAddress: "192.168.100.128/25",
});
const ipAddress6 = IPAddress.from({
  IPAddress: "192.168.100.128",
});
const ipAddress7 = IPAddress.from({
  IPAddress: "2001:db8:85a3:8d3:1319:8a2e:370:7348/64",
});
const ipAddress8 = IPAddress.from({
  IPAddress: "2001:db8:85a3:8d3:1319:8a2e:370:7348",
});

//* To verify if a value is an IP address, use the `isIPAddress` method:
if (IPAddress.isIPAddress(ipAddress1)) {
  console.log("ipAddress1 is an IP address");
}

//* Afterwards, you can get/set the properties of the IP address:
ipAddress1.IPAddress; // "192.168.100.128/25"
ipAddress1.IPAddressMinusSuffix; // "192.168.100.128"
ipAddress1.version; // "IPv4"
ipAddress1.subnet; // "/25"
ipAddress1.subnetMask; // 25
ipAddress1.startAddress; // "192.168.100.128"
ipAddress1.endAddress; // "192.168.100.255"

//* It has a `toString()` method that returns a string representation of the IP address:
ipAddress1.toString(); // "192.168.100.128/25"

//* It has a `toJSON()` method that returns a JSON representation of the IP address:
ipAddress1.toJSON(); // { IPAddress: "192.168.100.128/25" }

//* It has a `equals()` method that returns whether two IP addresses are equal:
ipAddress2.equals(ipAddress6); // true

//* It has a `contains()` method that returns whether an IP address contains another IP address:
const ipAddress9 = IPAddress.from("192.168.1.1/24");
const ipAddress10 = IPAddress.from("192.168.1.128");
ipAddress9.contains(ipAddress10); // true

//* It has a `toIPAddress4()` method that returns an Address4 representation of the IP address:
ipAddress1.toIPAddress4(); // Address4 { address: 192.168.100.128/25 }
ipAddress3.toIPAddress4(); // null

//* It has a `toIPAddress6()` method that returns an Address6 representation of the IP address:
ipAddress1.toIPAddress6(); // null
ipAddress3.toIPAddress6(); // Address6 { address: "2001:db8:85a3:8d3:1319:8a2e:370:7348/64" }
```

### MACAddress

Used to represent the following PostgreSQL data type(s):

- [`macaddr`][macaddr]
- [`_macaddr`][macaddr] (`macaddr[]`)

```ts
import { MACAddress } from "postgresql-type-parsers";

//* MAC addresses can be created in the following ways:
const macAddress1 = MACAddress.from("08:00:2b:01:02:03");
const macAddress2 = MACAddress.from({
  MACAddress: "08:00:2b:01:02:03",
});
const macAddress3 = MACAddress.from(8796814508547);

//* To verify if a value is a MAC address, use the `isMACAddress` method:
if (MACAddress.isMACAddress(macAddress1)) {
  console.log("macAddress1 is a MAC address");
}

//* Afterwards, you can get/set the properties of the MAC address:
macAddress1.MACAddress; // "08:00:2b:01:02:03"

//* It has a `toString()` method that returns a string representation of the MAC address:
macAddress1.toString(); // "08:00:2b:01:02:03"

//* It has a `toLong()` method that returns a long representation of the MAC address:
macAddress1.toLong(); // 8796814508547

//* It has a `toJSON()` method that returns a JSON representation of the MAC address:
macAddress1.toJSON(); // { MACAddress: "08:00:2b:01:02:03" }

//* It has a `equals()` method that returns whether two MAC addresses are equal:
macAddress1.equals(macAddress2); // true
```

### MACAddress8

Used to represent the following PostgreSQL data type(s):

- [`macaddr8`][macaddr8]
- [`_macaddr8`][macaddr8] (`macaddr8[]`)

```ts
import { MACAddress8 } from "postgresql-type-parsers";

//* MAC addresses can be created in the following ways:
const macAddress1 = MACAddress8.from("08:00:2b:01:02:03:04:05");
const macAddress2 = MACAddress8.from({
  MACAddress8: "08:00:2b:01:02:03:04:05",
});
const macAddress3 = MACAddress8.from(BigInt("576508035632137221"));

//* To verify if a value is a MAC address, use the `isMACAddress8` method:
if (MACAddress8.isMACAddress8(macAddress1)) {
  console.log("macAddress1 is a MAC address 8");
}

//* Afterwards, you can get/set the properties of the MAC address:
macAddress1.MACAddress8; // "08:00:2b:01:02:03:04:05"

//* It has a `toString()` method that returns a string representation of the MAC address:
macAddress1.toString(); // "08:00:2b:01:02:03:04:05"

//* It has a `toLong()` method that returns a long representation of the MAC address:
macAddress1.toLong(); // BigInt("576508035632137221")

//* It has a `toJSON()` method that returns a JSON representation of the MAC address:
macAddress1.toJSON(); // { MACAddress8: "08:00:2b:01:02:03:04:05" }

//* It has a `equals()` method that returns whether two MAC addresses are equal:
macAddress1.equals(macAddress2); // true
```

## Numeric Types

- [Int2](#int2)
- [Int4](#int4)
- [Int4MultiRange](#int4multirange)
- [Int4Range](#int4range)
- [Int8](#int8)
- [Int8MultiRange](#int8multirange)
- [Int8Range](#int8range)

### Int2

Used to represent the following PostgreSQL data type(s):

- [`int2`][int]
- [`_int2`][int] (`int2[]`)

```ts
import { Int2 } from "postgresql-type-parsers";

//* Int2s can be created in the following ways:
const int21 = Int2.from(1);
const int22 = Int2.from({
  int2: 1,
});
const int23 = Int2.from("1");

//* To verify if a value is an Int2, use the `isInt2` method:
if (Int2.isInt2(int21)) {
  console.log("int21 is an Int2");
}

//* Afterwards, you can get/set the properties of the Int2:
int21.int2; // 1

//* It has a `toString()` method that returns a string representation of the Int2:
int21.toString(); // "1"

//* It has a `toNumber()` method that returns a number representation of the Int2:
int21.toNumber(); // 1

//* It has a `equals()` method that returns whether two Int2s are equal:
int21.equals(int22); // true
```

### Int4

Used to represent the following PostgreSQL data type(s):

- [`int4`][int]
- [`_int4`][int] (`int4[]`)

```ts
import { Int4 } from "postgresql-type-parsers";

//* Int4s can be created in the following ways:
const int41 = Int4.from(1);
const int42 = Int4.from({
  int4: 1,
});
const int43 = Int4.from("1");

//* To verify if a value is an Int4, use the `isInt4` method:
if (Int4.isInt4(int41)) {
  console.log("int41 is an Int4");
}

//* Afterwards, you can get/set the properties of the Int4:
int41.int4; // 1

//* It has a `toString()` method that returns a string representation of the Int4:
int41.toString(); // "1"

//* It has a `toNumber()` method that returns a number representation of the Int4:
int41.toNumber(); // 1

//* It has a `equals()` method that returns whether two Int4s are equal:
int41.equals(int42); // true
```

### Int4MultiRange

Used to represent the following PostgreSQL data type(s):

- [`int4multirange`][multirange]
- [`_int4multirange`][multirange] (`int4multirange[]`)

```ts
import { Int4MultiRange, Int4 } from "postgresql-type-parsers";

//* Int4MultiRange can be created in the following ways:
const int4MultiRange1 = Int4MultiRange.from("{[1,9),[11, 19)}");
const int4MultiRange2 = Int4MultiRange.from({
  ranges: [Int4.from("[1,9)"), Int4.from("[11, 19)")],
});
const int4MultiRange3 = Int4MultiRange.from([
  Int4.from("[1,9)"),
  Int4.from("[11, 19)"),
]);
const int4MultiRange4 = Int4MultiRange.from(
  Int4.from("[1,9)"),
  Int4.from("[11, 19)")
);
const int4MultiRange5 = Int4MultiRange.from({
  ranges: [
    {
      lower: LowerRange.include,
      upper: UpperRange.exclude,
      value: [{ Int4: 1 }, { Int4: 9 }],
    },
    {
      lower: "(",
      upper: "]",
      value: [{ Int4: 11 }, { Int4: 19 }],
    },
  ],
});

//* To verify if a value is a int4 multi range, use the `isMultiRange` method:
if (Int4MultiRange.isMultiRange(int4MultiRange1)) {
  console.log("int4MultiRange1 is a int4 multi range");
}

//* Afterwards, you can get/set the properties of the int4 multi range:
int4MultiRange1.ranges; // [Int4, Int4]

//* It has a `toString()` method that returns a string representation of the int4 multi range:
int4MultiRange1.toString(); // "{[1,9),[11,19)}"

//* It has a `toJSON()` method that returns a JSON representation of the int4 multi range:
int4MultiRange1.toJSON(); // { ranges: [{ lower: "[", upper: ")", value: [Int4, Int4] }, { lower: "[", upper: ")", value: [Int4, Int4] }] }

//* It has a `equals()` method that returns whether two int4 multi ranges are equal:
int4MultiRange1.equals(int4MultiRange2); // true
```

### Int4Range

Used to represent the following PostgreSQL data type(s):

- [`int4range`][range]
- [`_int4range`][range] (`int4range[]`)

```ts
import {
  Int4,
  Int4Range,
  LowerRange,
  UpperRange,
} from "postgresql-type-parsers";

//* Int4Range can be created in the following ways:
const int4Range1 = Int4Range.from("[1,9)");
const int4Range2 = Int4Range.from({
  lower: LowerRange.include,
  upper: UpperRange.exclude,
  value: [
    { int4: 1 }, // lowerValue
    { int4: 9 }, // upperValue
  ],
});
const int4Range3 = Int4Range.from({
  lower: LowerRange.include,
  upper: UpperRange.exclude,
  value: [
    Int4.from({ int4: 1 }), // lowerValue
    Int4.from({ int4: 9 }), // upperValue
  ],
});
const int4Range4 = Int4Range.from(
  Int4.from({ int4: 1 }), // lowerValue
  Int4.from({ int4: 9 }) // upperValue
); // Defaults to [lowerValue, upperValue)
const int4Range5 = Int4Range.from([
  Int4.from({ int4: 1 }), //lowerValue
  Int4.from({ int4: 9 }), //upperValue
]); // Defaults to [lowerValue, upperValue)

//* To verify if a value is a int4 range, use the `isRange` method:
if (Int4Range.isRange(int4Range1)) {
  console.log("int4Range1 is a int4 range");
}

//* Afterwards, you can get/set the properties of the int4 range:
int4Range1.lower; // LowerRange.include
int4Range1.upper; // UpperRange.exclude
int4Range1.value; // [Int4 { int4: 1 }, Int4 { int4: 9 }]

//* It has a `toString()` method that returns a string representation of the int4 range:
int4Range1.toString(); // "[1,9)"

//* It has a `toJSON()` method that returns a JSON representation of the int4 range:
int4Range1.toJSON(); // { lower: LowerRange.include, upper: UpperRange.exclude, value: [ { int4: 1 }, { int4: 9 } ] }

//* It has a `equals()` method that returns whether two int4 ranges are equal:
int4Range1.equals(int4Range2); // true

//* It has a `empty` readonly property that returns whether the int4 range is empty:
int4Range1.empty; // false
const int4Range6 = Int4Range.from("[1,1)");
int4Range6.empty; // true
const int4Range7 = Int4Range.from("empty");
int4Range7.empty; // true

//! Note that if a Int4Range is empty, it will have a `null` value.
int4Range6.value; // null
int4Range7.value; // null

//* It has a `isWithinRange()` method that returns whether a int4 is within the range:
int4Range1.isWithinRange(Int4.from("7")); // true
```

### Int8

Used to represent the following PostgreSQL data type(s):

- [`int8`][int]
- [`_int8`][int] (`int8[]`)

```ts
import { Int8 } from "postgresql-type-parsers";

//* Int8s can be created in the following ways:
const int81 = Int8.from(1);
const int82 = Int8.from({
  int8: 1,
});
const int83 = Int8.from("1");
const int84 = Int8.from(BigInt("1"));

//* To verify if a value is an Int8, use the `isInt8` method:
if (Int8.isInt8(int81)) {
  console.log("int81 is an Int8");
}

//* Afterwards, you can get/set the properties of the Int8:
int81.int8; // BigInt(1)

//* It has a `toString()` method that returns a string representation of the Int8:
int81.toString(); // "1"

//* It has a `toBigint()` method that returns a number representation of the Int8:
int81.toBigint(); // BigInt(1)

//* It has a `equals()` method that returns whether two Int8s are equal:
int81.equals(int82); // true
```

### Int8MultiRange

Used to represent the following PostgreSQL data type(s):

- [`int8multirange`][multirange]
- [`_int8multirange`][multirange] (`int8multirange[]`)

```ts
import { Int8MultiRange, Int8 } from "postgresql-type-parsers";

//* Int8MultiRange can be created in the following ways:
const int8MultiRange1 = Int8MultiRange.from("{[1,9),[11, 19)}");
const int8MultiRange2 = Int8MultiRange.from({
  ranges: [Int8.from("[1,9)"), Int8.from("[11, 19)")],
});
const int8MultiRange3 = Int8MultiRange.from([
  Int8.from("[1,9)"),
  Int8.from("[11, 19)"),
]);
const int8MultiRange4 = Int8MultiRange.from(
  Int8.from("[1,9)"),
  Int8.from("[11, 19)")
);
const int8MultiRange5 = Int8MultiRange.from({
  ranges: [
    {
      lower: LowerRange.include,
      upper: UpperRange.exclude,
      value: [{ Int8: BigInt(1) }, { Int8: BigInt(9) }],
    },
    {
      lower: "(",
      upper: "]",
      value: [{ Int8: BigInt(11) }, { Int8: BigInt(19) }],
    },
  ],
});

//* To verify if a value is a int8 multi range, use the `isMultiRange` method:
if (Int8MultiRange.isMultiRange(int8MultiRange1)) {
  console.log("int8MultiRange1 is a int8 multi range");
}

//* Afterwards, you can get/set the properties of the int8 multi range:
int8MultiRange1.ranges; // [Int8, Int8]

//* It has a `toString()` method that returns a string representation of the int8 multi range:
int8MultiRange1.toString(); // "{[1,9),[11,19)}"

//* It has a `toJSON()` method that returns a JSON representation of the int8 multi range:
int8MultiRange1.toJSON(); // { ranges: [{ lower: "[", upper: ")", value: [Int8, Int8] }, { lower: "[", upper: ")", value: [Int8, Int8] }] }

//* It has a `equals()` method that returns whether two int8 multi ranges are equal:
int8MultiRange1.equals(int8MultiRange2); // true
```

### Int8Range

Used to represent the following PostgreSQL data type(s):

- [`int8range`][range]
- [`_int8range`][range] (`int8range[]`)

```ts
import {
  Int8,
  Int8Range,
  LowerRange,
  UpperRange,
} from "postgresql-type-parsers";

//* Int8Range can be created in the following ways:
const int8Range1 = Int8Range.from("[1,9)");
const int8Range2 = Int8Range.from({
  lower: LowerRange.include,
  upper: UpperRange.exclude,
  value: [
    { int8: BigInt(1) }, // lowerValue
    { int8: BigInt(9) }, // upperValue
  ],
});
const int8Range3 = Int8Range.from({
  lower: LowerRange.include,
  upper: UpperRange.exclude,
  value: [
    Int8.from({ int8: BigInt(1) }), // lowerValue
    Int8.from({ int8: BigInt(9) }), // upperValue
  ],
});
const int8Range4 = Int8Range.from(
  Int8.from({ int8: BigInt(1) }), // lowerValue
  Int8.from({ int8: BigInt(9) }) // upperValue
); // Defaults to [lowerValue, upperValue)
const int8Range5 = Int8Range.from([
  Int8.from({ int8: BigInt(1) }), //lowerValue
  Int8.from({ int8: BigInt(9) }), //upperValue
]); // Defaults to [lowerValue, upperValue)

//* To verify if a value is a int8 range, use the `isRange` method:
if (Int8Range.isRange(int8Range1)) {
  console.log("int8Range1 is a int8 range");
}

//* Afterwards, you can get/set the properties of the int8 range:
int8Range1.lower; // LowerRange.include
int8Range1.upper; // UpperRange.exclude
int8Range1.value; // [Int8 { int8: BigInt(1) }, Int8 { int8: BigInt(9) }]

//* It has a `toString()` method that returns a string representation of the int8 range:
int8Range1.toString(); // "[1,9)"

//* It has a `toJSON()` method that returns a JSON representation of the int8 range:
int8Range1.toJSON(); // { lower: LowerRange.include, upper: UpperRange.exclude, value: [ { int8: BigInt(1) }, { int8: BigInt(9) } ] }

//* It has a `equals()` method that returns whether two int8 ranges are equal:
int8Range1.equals(int8Range2); // true

//* It has a `empty` readonly property that returns whether the int8 range is empty:
int8Range1.empty; // false
const int8Range6 = Int8Range.from("[1,1)");
int8Range6.empty; // true
const int8Range7 = Int8Range.from("empty");
int8Range7.empty; // true

//! Note that if a Int8Range is empty, it will have a `null` value.
int8Range6.value; // null
int8Range7.value; // null

//* It has a `isWithinRange()` method that returns whether a int8 is within the range:
int8Range1.isWithinRange(Int8.from("7")); // true
```

## UUID Type

- [UUID](#uuid)

### UUID

Used to represent the following PostgreSQL data type(s):

- [`uuid`][uuid]
- [`_uuid`][uuid] (`uuid[]`)

```ts
import { UUID } from "postgresql-type-parsers";

//* UUIDs can be created in the following ways:
const uuid1 = UUID.from("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
const uuid2 = UUID.from({
  uuid: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
});
const uuid3 = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11"); //Will be converted to lowercase
const uuid4 = UUID.generate(); //Generates a random UUID using `node:crypto`

//* To verify if a value is a UUID, use the `isUUID` method:
if (UUID.isUUID(uuid1)) {
  console.log("uuid1 is a UUID");
}

//* Afterwards, you can get/set the properties of the UUID:
uuid1.uuid; // "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"

//* It has a `toString()` method that returns a string representation of the UUID:
uuid1.toString(); // "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"

//* It has a `toJSON()` method that returns a JSON representation of the UUID:
uuid1.toJSON(); // { uuid: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" }

//* It has a `equals()` method that returns whether two UUIDs are equal:
uuid1.equals(uuid2); // true
```

[box]: https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.8
[cidr]: https://www.postgresql.org/docs/current/datatype-net-types.html#DATATYPE-CIDR
[circle]: https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-CIRCLE
[datetime]: https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-DATETIME-INPUT
[inet]: https://www.postgresql.org/docs/current/datatype-net-types.html#DATATYPE-INET
[int]: https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-INT
[interval]: https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-INTERVAL-INPUT
[line]: https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LINE
[lseg]: https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LSEG
[macaddr]: https://www.postgresql.org/docs/current/datatype-net-types.html#DATATYPE-MACADDR
[macaddr8]: https://www.postgresql.org/docs/current/datatype-net-types.html#DATATYPE-MACADDR8
[multirange]: https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-CONSTRUCT
[path]: https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9
[point]: https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.5
[polygon]: https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-POLYGON
[range]: https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-IO
[uuid]: https://www.postgresql.org/docs/current/datatype-uuid.html
