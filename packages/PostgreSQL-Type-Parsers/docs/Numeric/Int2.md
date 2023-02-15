<h1 align="center">
	Int2
</h1>
<p align="center">
  The <code>Int2</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-INT"><code>int2</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-INT"><code>_int2</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Int2 } from "postgresql-type-parsers";

//* Int2s can be created in the following ways:
const int21 = Int2.from(1);
const int22 = Int2.from({
  int2: 1,
});
const int23 = Int2.from("1");


//* If you pass an invalid value, it will throw an error:
Int2.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Int2.safeFrom("abc"); // { success: false, error: Error }
Int2.safeFrom("1"); // { success: true, data: Int2(1) }

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

//* It has a `toJSON()` method that returns a JSON representation of the Int2:
int21.toJSON(); // { int2: 1 }

//* It has a `equals()` method that returns whether two int2s are equal:
int21.equals(int22); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
int21.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
int21.safeEquals("abc"); // { success: false, error: Error }
int21.safeEquals(int22); // { success: true, equals: true, data: int22 }
int21.safeEquals("2"); // { success: true, equals: false, data: Int2(2) }
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