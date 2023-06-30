<h1 align="center">
	JSON
</h1>
<p align="center">
  The <code>JSON</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-json.html"><code>json</code></a>, <a href="https://www.postgresql.org/docs/current/datatype-json.html"><code>_json</code></a>, <a href="https://www.postgresql.org/docs/current/datatype-json.html"><code>jsonb</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-json.html"><code>_jsonb</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { JSON } from "@postgresql-typed/parsers";

//* JSONs can be created in the following ways:
const json1 = JSON.from('{"foo":"bar"}');
const json2 = JSON.from({
  value: '{"foo":"bar"}',
});
const json3 = JSON.from({
  foo: "bar",
});

//* If you pass an invalid value, it will throw an error:
JSON.from('{"abc}'); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
JSON.safeFrom('{"abc}'); // { success: false, error: Error }
JSON.safeFrom('{"foo":"bar"}'); // { success: true, data: JSON('{"foo":"bar"}') }

//* To verify if a value is a JSON, use the `isJSON` method:
if (JSON.isJSON(json1)) {
  console.log("json1 is a JSON");
}

//* Afterwards, you can get/set the properties of the JSON:
json1.value; // '{"foo":"bar"}'
json.json; // { foo: "bar" }

//* It has a `toString()` method that returns a string representation of the JSON:
json1.toString(); // '{"foo":"bar"}'

//* It has a `toJSON()` method that returns a JSON representation of the JSON:
json1.toJSON(); // { value: '{"foo":"bar"}' }

//* It has a `equals()` method that returns whether two JSONs are equal:
json1.equals(json2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
json1.equals('{"abc}'); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
json1.safeEquals('{"abc}'); // { success: false, error: Error }
json1.safeEquals(json2); // { success: true, equals: true, data: json2 }
json1.safeEquals('{"foo":"bar"}'); // { success: true, equals: false, data: JSON('{"foo":"bar"}') }
```

<p align="center">
  <!-- Back to main README button -->
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/-Back%20to%20main%20README-blue" alt="Back to main README" />
  </a>
</p>