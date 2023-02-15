<h1 align="center">
	Box
</h1>
<p align="center">
  The <code>Box</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.8"><code>box</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.8"><code>_box</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Box } from "postgresql-type-parsers";

//* Box can be created in the following ways:
const box1 = Box.from("(1,2),(3,4)");
const box2 = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
const box3 = Box.from(1, 2, 3, 4);

//* If you pass an invalid value, it will throw an error:
Box.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Box.safeFrom("abc"); // { success: false, error: Error }
Box.safeFrom("(1,2),(3,4)"); // { success: true, data: Box((1,2),(3,4)) }

//* To verify if a value is a box, use the `isBox` method:
if (Box.isBox(box1)) {
  console.log("box1 is a box");
}

//* Afterwards, you can get/set the properties of the box:
box1.x1; // 1
box1.y1; // 2
box1.x2; // 3
box1.y2; // 4

//* It has a `toString()` method that returns a string representation of the box:
box1.toString(); // "(1,2),(3,4)"

//* It has a `toJSON()` method that returns a JSON representation of the box:
box1.toJSON(); // { x1: 1, y1: 2, x2: 3, y2: 4 }

//* It has a `equals()` method that returns whether two boxes are equal:
box1.equals(box2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
box1.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
box1.safeEquals("abc"); // { success: false, error: Error }
box1.safeEquals(box2); // { success: true, equals: true, data: box2 }
box1.safeEquals("(1,2),(5,6)"); // { success: true, equals: false, data: Box((1,2),(5,6)) }
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