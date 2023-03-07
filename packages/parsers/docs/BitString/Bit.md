<h1 align="center">
	Bit
</h1>
<p align="center">
  The <code>Bit</code> parser is used to represet the <a href="https://www.postgresql.org/docs/8.1/datatype-bit.html"><code>bit</code></a> and <a href="https://www.postgresql.org/docs/8.1/datatype-bit.html"><code>_bit</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Bit } from "@postgresql-typed/parsers";

//* Bits can be created in the following ways:
const bit1 = Bit.from(1);
const bit2 = Bit.from({
  bit: "1",
});
const bit3 = Bit.from("1");

//* By default the n value of the Bit is 1, you can use the `setN` method to customize this:
const bitN3 = Bit.setN(3);
// You can now parse higher bits
// bitN3.from(5)
// bitN3.from("101")


//* If you pass an invalid value, it will throw an error:
Bit.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Bit.safeFrom("abc"); // { success: false, error: Error }
Bit.safeFrom("1"); // { success: true, data: Bit<1>(1) }

//* To verify if a value is an Bit<N>, use the `isBit<N>` method:
if (Bit.isBit(bit1)) { // By default it uses the N value of the Bit (in this case 1)
  console.log("bit1 is an Bit<1>");
}
//* You can also pass the N value as a parameter:
if (Bit.isBit(bit1, 3)) {
  console.log("bit1 is an Bit<3>")
}

//* You can also use the `isAnyBit` method to verify if a value is an Bit of any N value:
if (Bit.isAnyBit(bit1)) {
  console.log("bit1 is an Bit of any N value");
}

//* Afterwards, you can get/set the properties of the Bit:
bit1.bit; // "1"

//* It has a `toString()` method that returns a string representation of the Bit:
bit1.toString(); // "1"

//* It has a `toBigNumber()` method that returns a big number representation of the Bit:
bit1.toNumber(); // 1

//* It has a `toJSON()` method that returns a JSON representation of the Bit:
bit1.toJSON(); // { bit: "1" }

//* It has a `equals()` method that returns whether two bits are equal:
bit1.equals(bit2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
bit1.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
bit1.safeEquals("abc"); // { success: false, error: Error }
bit1.safeEquals(bit2); // { success: true, equals: true, data: bit2 }
bit1.safeEquals("0"); // { success: true, equals: false, data: Bit(0) }
```

<p align="center">
  <!-- Back to main README button -->
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/-Back%20to%20main%20README-blue" alt="Back to main README" />
  </a>
  <!-- Back to category button -->
  <a href="./BitString.md">
    <img src="https://img.shields.io/badge/-Back%20to%20Bit%20String%20category-blue" alt="Back to Bit String category" />
  </a>
</p>