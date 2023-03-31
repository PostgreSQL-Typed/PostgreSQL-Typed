<h1 align="center">
	OID
</h1>
<p align="center">
  The <code>OID</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-oid.html"><code>oid</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-oid.html"><code>_oid</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { OID } from "@postgresql-typed/parsers";

//* OIDs can be created in the following ways:
const oid1 = OID.from(1);
const oid2 = OID.from({
  value: 1,
});
const oid3 = OID.from("1");


//* If you pass an invalid value, it will throw an error:
OID.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
OID.safeFrom("abc"); // { success: false, error: Error }
OID.safeFrom("1"); // { success: true, data: OID(1) }

//* To verify if a value is an OID, use the `isOID` method:
if (OID.isOID(oid1)) {
  console.log("oid1 is an OID");
}

//* Afterwards, you can get/set the properties of the OID:
oid1.value; // 1

//* It has a `toString()` method that returns a string representation of the OID:
oid1.toString(); // "1"

//* It has a `toNumber()` method that returns a number representation of the OID:
oid1.toNumber(); // 1

//* It has a `toJSON()` method that returns a JSON representation of the OID:
oid1.toJSON(); // { value: 1 }

//* It has a `equals()` method that returns whether two oids are equal:
oid1.equals(oid2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
oid1.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
oid1.safeEquals("abc"); // { success: false, error: Error }
oid1.safeEquals(oid2); // { success: true, equals: true, data: oid2 }
oid1.safeEquals("2"); // { success: true, equals: false, data: OID(2) }
```

<p align="center">
  <!-- Back to main README button -->
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/-Back%20to%20main%20README-blue" alt="Back to main README" />
  </a>
</p>