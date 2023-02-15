<h1 align="center">
	UUID
</h1>
<p align="center">
  The <code>UUID</code> parser is used to represet the <a href="ttps://www.postgresql.org/docs/current/datatype-uuid.html"><code>uuid</code></a> and <a href="ttps://www.postgresql.org/docs/current/datatype-uuid.html"><code>_uuid</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { UUID } from "postgresql-type-parsers";

//* UUIDs can be created in the following ways:
const uuid1 = UUID.from("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
const uuid2 = UUID.from({
  uuid: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
});
const uuid3 = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11"); //Will be converted to lowercase
const uuid4 = UUID.generate(); //Generates a random UUID using `node:crypto`


//* If you pass an invalid value, it will throw an error:
UUID.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
UUID.safeFrom("abc"); // { success: false, error: Error }
UUID.safeFrom("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"); // { success: true, data: UUID(a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11) }

//* To verify if a value is a UUID, use the `isUUID` method:
if (UUID.isUUID(uuid1)) {
  console.log("uuid1 is a UUID");
}

//* Afterwards, you can get/set the properties of the UUID:
uuid1.uuid; // "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"

//* It has a `toString()` method that returns a string representation of the UUID:
uuid1.toString(); // "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"

//* It has a `toJSON()` method that returns a JSON representation of the UUID:
uuid1.toJSON(); // { uuid: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" }

//* It has a `equals()` method that returns whether two UUIDs are equal:
uuid1.equals(uuid2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
uuid1.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
uuid1.safeEquals("abc"); // { success: false, error: Error }
uuid1.safeEquals(uuid2); // { success: true, equals: true, data: uuid2 }
uuid1.safeEquals("4a9b3745-ad64-433b-929a-30d11015ed0f"); // { success: true, equals: false, data: UUID(4a9b3745-ad64-433b-929a-30d11015ed0f) }
```

<p align="center">
  <!-- Back to main README button -->
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/-Back%20to%20main%20README-blue" alt="Back to main README" />
  </a>
</p>