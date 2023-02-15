<h1 align="center">
	LineSegment
</h1>
<p align="center">
  The <code>LineSegment</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LSEG"><code>lseg</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LSEG"><code>_lseg</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { LineSegment, Point } from "postgresql-type-parsers";

//* LineSegment can be created in the following ways:
const lineSegment1 = LineSegment.from("[(1,2),(3,4)]");
const lineSegment2 = LineSegment.from({
  a: Point.from(1, 2),
  b: Point.from(3, 4),
});
const lineSegment3 = LineSegment.from({
  a: {
    x: 1,
    y: 2,
  },
  b: {
    x: 3,
    y: 4,
  },
});
const lineSegment4 = LineSegment.from(Point.from(1, 2), Point.from(3, 4));

//* If you pass an invalid value, it will throw an error:
LineSegment.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
LineSegment.safeFrom("abc"); // { success: false, error: Error }
LineSegment.safeFrom("[(1,2),(3,4)]"); // { success: true, data: LineSegment([(1,2),(3,4)]) }

//* To verify if a value is a line segment, use the `isLineSegment` method:
if (LineSegment.isLineSegment(lineSegment1)) {
  console.log("lineSegment1 is a line segment");
}

//* Afterwards, you can get/set the properties of the line segment:
lineSegment1.a; // Point { x: 1, y: 2 }
lineSegment1.b; // Point { x: 3, y: 4 }

//* It has a `toString()` method that returns a string representation of the line segment:
lineSegment1.toString(); // "[(1,2),(3,4)]"

//* It has a `toJSON()` method that returns a JSON representation of the line segment:
lineSegment1.toJSON(); // { a: { x: 1, y: 2 }, b: { x: 3, y: 4 } }

//* It has a `equals()` method that returns whether two line segments are equal:
lineSegment1.equals(lineSegment2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
lineSegment1.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
lineSegment1.safeEquals("abc"); // { success: false, error: Error }
lineSegment1.safeEquals(lineSegment2); // { success: true, equals: true, data: lineSegment2 }
lineSegment1.safeEquals("[(1,2),(5,6)]"); // { success: true, equals: false, data: LineSegment([(1,2),(5,6)]) }
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