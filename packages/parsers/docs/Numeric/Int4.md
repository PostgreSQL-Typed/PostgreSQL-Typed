<h1 align="center">
	Int4
</h1>
<p align="center">
  The <code>Int4</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-INT"><code>int4</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-INT"><code>_int4</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Int4 } from "@postgresql-typed/parsers";

//* Int4s can be created in the following ways:
const int41 = Int4.from(1);
const int42 = Int4.from({
  int4: 1,
});
const int43 = Int4.from("1");


//* If you pass an invalid value, it will throw an error:
Int4.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Int4.safeFrom("abc"); // { success: false, error: Error }
Int4.safeFrom("1"); // { success: true, data: Int4(1) }

//* To verify if a value is an Int4, use the `isInt4` method:
if (Int4.isInt4(int41)) {
  console.log("int41 is an Int4");
}

//* Afterwards, you can get/set the properties of the Int4:
int41.int4; // 1

//* It has a `toString()` method that returns a string representation of the int4:
int41.toString(); // "1"

//* It has a `toNumber()` method that returns a number representation of the Int4:
int41.toNumber(); // 1

//* It has a `toJSON()` method that returns a JSON representation of the int4:
int41.toJSON(); // { int4: 1 }

//* It has a `equals()` method that returns whether two int4s are equal:
int41.equals(int42); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
int41.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
int41.safeEquals("abc"); // { success: false, error: Error }
int41.safeEquals(int42); // { success: true, equals: true, data: int42 }
int41.safeEquals("2"); // { success: true, equals: false, data: Int4(2) }
```

<p align="center">
  <!-- Back to main README button -->
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/-Back%20to%20main%20README-blue" alt="Back to main README" />
  </a>
  <!-- Back to category button -->
  <a href="./Numeric.md">
    <img src="https://img.shields.io/badge/-Back%20to%20Numeric%20category-blue" alt="Back to Numeric category" />
  </a>
</p>