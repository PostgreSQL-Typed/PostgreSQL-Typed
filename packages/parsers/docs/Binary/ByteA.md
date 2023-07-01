<h1 align="center">
	ByteA
</h1>
<p align="center">
  The <code>ByteA</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-binary.html"><code>bytea</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-binary.html"><code>_bytea</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { ByteA } from "@postgresql-typed/parsers";

//* ByteAs can be created in the following ways:
const bytea1 = ByteA.from("\\x1234");
const bytea2 = ByteA.from({
  value: Buffer.from([0x12, 0x34]),
});
const bytea3 = ByteA.from(Buffer.from([0x12, 0x34]));


//* If you pass an invalid value, it will throw an error:
ByteA.from(true); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
ByteA.safeFrom(true); // { success: false, error: Error }
ByteA.safeFrom("\\x1234"); // { success: true, data: ByteA(\x1234) }

//* To verify if a value is a ByteA, use the `isByteA` method:
if (ByteA.isByteA(bytea1)) {
  console.log("bytea1 is a ByteA");
}

//* Afterwards, you can get/set the properties of the ByteA:
bytea1.value; // Buffer.from([0x12, 0x34])

//* It has a `toString()` method that returns a string representation of the ByteA:
bytea1.toString(); // "\\x1234"

//* It has a `toJSON()` method that returns a JSON representation of the ByteA:
bytea1.toJSON(); // { value: Buffer.from([0x12, 0x34]) }

//* It has a `equals()` method that returns whether two ByteAs are equal:
bytea1.equals(bytea2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
bytea1.equals(true); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
bytea1.safeEquals(true); // { success: false, error: Error }
bytea1.safeEquals(bytea2); // { success: true, equals: true, data: bytea2 }
bytea1.safeEquals("\\x1234"); // { success: true, equals: false, data: ByteA(\x1234) }
```

<p align="center">
  <!-- Back to main README button -->
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/-Back%20to%20main%20README-blue" alt="Back to main README" />
  </a>
</p>