<h1 align="center">
	Line
</h1>
<p align="center">
  The <code>Line</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LINE"><code>line</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LINE"><code>_line</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Line } from "@postgresql-typed/parsers";

//* Lines can be created in the following ways:
const line1 = Line.from({ a: 1, b: 2, c: 3 });
const line2 = Line.from("{1,2,3}");
const line3 = Line.from(1, 2, 3); //a, b, c

//* If you pass an invalid value, it will throw an error:
Line.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Line.safeFrom("abc"); // { success: false, error: Error }
Line.safeFrom("{1,2,3}"); // { success: true, data: Line({1,2,3}) }

//* To verify if a value is a line, use the `isLine` method:
if (Line.isLine(line1)) {
  console.log("line1 is a line");
}

//* Afterwards, you can get/set the properties of the line:
line1.a; // 1
line1.b; // 2
line1.c; // 3

line1.value; // "{1,2,3}"

//* It has a `toString()` method that returns a string representation of the line:
line1.toString(); // "{1,2,3}"

//* It has a `toJSON()` method that returns a JSON representation of the line:
line1.toJSON(); // { a: 1, b: 2, c: 3 }

//* It has a `equals()` method that returns whether two lines are equal:
line1.equals(line2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
line1.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
line1.safeEquals("abc"); // { success: false, error: Error }
line1.safeEquals(line2); // { success: true, equals: true, data: line2 }
line1.safeEquals("{1,3,5}"); // { success: true, equals: false, data: Line({1,3,5}) }
```

<p align="center">
  <!-- Back to main README button -->
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/-Back%20to%20main%20README-blue" alt="Back to main README" />
  </a>
  <!-- Back to category button -->
  <a href="./Geometric.md">
    <img src="https://img.shields.io/badge/-Back%20to%20Geometric%20category-blue" alt="Back to Geometric category" />
  </a>
</p>