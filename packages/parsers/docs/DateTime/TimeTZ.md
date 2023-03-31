<h1 align="center">
	TimeTZ
</h1>
<p align="center">
  The <code>TimeTZ</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-DATETIME-INPUT"><code>timetz</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-DATETIME-INPUT"><code>_timetz</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { TimeTZ, OffsetDirection } from "@postgresql-typed/parsers";
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

//* If you pass an invalid value, it will throw an error:
TimeTZ.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
TimeTZ.safeFrom("abc"); // { success: false, error: Error }
TimeTZ.safeFrom("12:34:56.789Z"); // { success: true, data: TimeTZ(12:34:56.789Z) }

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

timeTZ1.value; // "12:34:56.789-05:00"

//* It has a `toString()` method that returns a string representation of the timeTZ:
timeTZ1.toString(); // "12:34:56.789-05:00"

//* It has a `toJSON()` method that returns a JSON representation of the timeTZ:
timeTZ1.toJSON(); // { hours: 12, minutes: 34, seconds: 56.789, offset: { hours: 5, minutes: 0, direction: "minus" } }

//* It has a `equals()` method that returns whether two timeTZs are equal:
timeTZ1.equals(timeTZ2); // true

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
timeTZ1.safeEquals("abc"); // { success: false, error: Error }
timeTZ1.safeEquals(timeTZ2); // { success: true, equals: true, data: timeTZ2 }
timeTZ1.safeEquals("15:34:56.789Z"); // { success: true, equals: false, data: TimeTZ(15:34:56.789Z) }

//* It has a `toTime()` method that returns a `Time` representation of the timeTZ:
timeTZ1.toTime(); // Time { hours: 12, minutes: 34, seconds: 56.789 }

//* It has a `toDateTime()` method that returns a `DateTime` representation of the date: (defaults to the current timezone)
timeTZ1.toDateTime(); // DateTime { hours: 12, minutes: 34, seconds: 56.789, zone: "EST" }

//* It has a `toJSDate()` method that returns a JavaScript `Date` representation of the date: (defaults to the current timezone)
timeTZ1.toJSDate(); // Date { hours: 12, minutes: 34, seconds: 56.789, zone: "EST" }
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