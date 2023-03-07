<h1 align="center">
	Interval
</h1>
<p align="center">
  The <code>Interval</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-INTERVAL-INPUT"><code>interval</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-INTERVAL-INPUT"><code>_interval</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Interval } from "@postgresql-typed/parsers";

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

//* If you pass an invalid value, it will throw an error:
Interval.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Interval.safeFrom("abc"); // { success: false, error: Error }
Interval.safeFrom("1 year -32 days"); // { success: true, data: Interval(1 year -32 days) }

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

//* It has a `toString()` method that returns a string representation of the interval:
interval6.toString(); // "1 year 2 months 3 days 4 hours 5 minutes 6.007 seconds"

//* The `toString()` method accepts a `style` parameter that can be one of the following:
/**
 * const interval = Interval.from("1 year 2 months 4 hours 5 minutes 6 seconds 7 milliseconds");
 *
 * interval.toString(); // "1 year 2 months 4 hours 5 minutes 6 seconds 7 milliseconds"
 * interval.toString("PostgreSQL"); // "1 year 2 months 4 hours 5 minutes 6 seconds 7 milliseconds"
 * interval.toString("PostgreSQL-Short"); // "1 yr 2 mons 4hrs 5mins 6secs 7msecs"
 * interval.toString("PostgreSQL-Time"); // "1 year 2 months 04:05:06.007"
 * interval.toString("PostgreSQL-Time-Short"); // "1 yr 2 mons 04:05:06.007"
 * interval.toString("ISO"); // "P1Y2M0DT4H5M6.007S"
 * interval.toString("ISO-Short"); // "P1Y2M4TH5M6.007S"
 * interval.toString("ISO-Basic"); // "P00010200T040506.007"
 * interval.toString("ISO-Extended"); // "P0001-02-00T04:05:06.007"
 * interval.toString("SQL"); // "1-2 04:05:06.007"
 */

//* It has a `toJSON()` method that returns a JSON representation of the interval:
interval6.toJSON(); // { years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6, milliseconds: 7 }

//* It has a `equals()` method that returns whether two intervals are equal:
interval6.equals(interval5); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
interval6.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
interval6.safeEquals("abc"); // { success: false, error: Error }
interval6.safeEquals(interval5); // { success: true, equals: true, data: interval5 }
interval6.safeEquals(interval4); // { success: true, equals: false, data: interval4 }
```

<p align="center">
  <!-- Back to main README button -->
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/-Back%20to%20main%20README-blue" alt="Back to main README" />
  </a>
  <!-- Back to category button -->
  <a href="./DateTime.md">
    <img src="https://img.shields.io/badge/-Back%20to%20DateTime%20category-blue" alt="Back to DateTime category" />
  </a>
</p>