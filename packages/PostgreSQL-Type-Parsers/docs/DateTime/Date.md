<h1 align="center">
	Date
</h1>
<p align="center">
  The <code>Date</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-DATETIME-INPUT"><code>date</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-DATETIME-INPUT"><code>_date</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Date } from "postgresql-type-parsers";
import { DateTime } from "luxon";

//* Date can be created in the following ways:
const date1 = Date.from("2020-01-01");
const date2 = Date.from({ year: 2020, month: 1, day: 1 });
const date3 = Date.from(2020, 1, 1); //year, month, day
const date4 = Date.from(DateTime.fromISO("2020-01-01")); // Luxon DateTime
const date5 = Date.from(new globalThis.Date("2020-01-01")); // JavaScript Date

//* If you pass an invalid value, it will throw an error:
Date.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Date.safeFrom("abc"); // { success: false, error: Error }
Date.safeFrom("2020-01-01"); // { success: true, data: Date(2020-01-01) }

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

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
date1.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
date1.safeEquals("abc"); // { success: false, error: Error }
date1.safeEquals(date2); // { success: true, equals: true, data: date2 }
date1.safeEquals("2021-01-01"); // { success: true, equals: false, data: Date(2021-01-01) }

//* It has a `toDateTime()` method that returns a Luxon `DateTime` representation of the date: (defaults to the current timezone)
date1.toDateTime(); // DateTime { year: 2020, month: 1, day: 1 }
date1.toDateTime("America/New_York"); // DateTime { year: 2020, month: 1, day: 1, zone: "America/New_York" }

//* It has a `toJSDate()` method that returns a JavaScript `Date` representation of the date: (defaults to the current timezone)
date1.toJSDate(); // Date { year: 2020, month: 1, day: 1 }
date1.toJSDate("America/New_York"); // Date { year: 2020, month: 1, day: 1, zone: "America/New_York" }
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