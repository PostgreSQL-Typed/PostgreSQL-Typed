<h1 align="center">
	Int8
</h1>
<p align="center">
  The <code>Int8</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-INT"><code>int8</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-INT"><code>_int8</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Int8 } from "@postgresql-typed/parsers";

//* Int8s can be created in the following ways:
const int81 = Int8.from(1);
const int82 = Int8.from({
  int8: 1,
});
const int83 = Int8.from("1");
const int84 = Int8.from(BigInt("1"));


//* If you pass an invalid value, it will throw an error:
Int8.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Int8.safeFrom("abc"); // { success: false, error: Error }
Int8.safeFrom("1"); // { success: true, data: Int8(1) }

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

//* It has a `toJSON()` method that returns a JSON representation of the Int8:
int81.toJSON(); // { int8: BigInt(1) }

//* It has a `equals()` method that returns whether two int8s are equal:
int81.equals(int82); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
int81.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
int81.safeEquals("abc"); // { success: false, error: Error }
int81.safeEquals(int82); // { success: true, equals: true, data: int82 }
int81.safeEquals("2"); // { success: true, equals: false, data: Int8(2) }
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