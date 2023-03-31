<h1 align="center">
	Path
</h1>
<p align="center">
  The <code>Path</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9"><code>path</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9"><code>_path</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Path, Point } from "@postgresql-typed/parsers";

//* Path can be created in the following ways:
const path1 = Path.from("((1,2),(3,4))");
const path2 = Path.from([Point.from(1, 2), Point.from(3, 4)]); //Defaults connection to `open`
const path3 = Path.from({
  points: [
    { x: 1, y: 2 },
    { x: 3, y: 4 },
  ],
  connection: "closed",
});
const path4 = Path.from(Point.from(1, 2), Point.from(3, 4)); //Defaults connection to `open`
const path5 = Path.from({
  points: [Point.from(1, 2), Point.from(3, 4)],
  connection: "closed",
});

//* If you pass an invalid value, it will throw an error:
Path.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Path.safeFrom("abc"); // { success: false, error: Error }
Path.safeFrom("((1,2),(3,4))"); // { success: true, data: Path(((1,2),(3,4))) }

//* To verify if a value is a path, use the `isPath` method:
if (Path.isPath(path1)) {
  console.log("path1 is a path");
}

//* Afterwards, you can get/set the properties of the path:
path1.points; // [ Point { x: 1, y: 2 }, Point { x: 3, y: 4 } ]
path1.connection; // "closed"

path1.value; // "((1,2),(3,4))"

//* It has a `toString()` method that returns a string representation of the polygon:
path1.toString(); // "((1,2),(3,4))"

//* It has a `toJSON()` method that returns a JSON representation of the polygon:
path1.toJSON(); // { points: [ { x: 1, y: 2 }, { x: 3, y: 4 } ], connection: "closed" }

//* It has a `equals()` method that returns whether two polygons are equal:
path1.equals(path3); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
path1.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
path1.safeEquals("abc"); // { success: false, error: Error }
path1.safeEquals(path3); // { success: true, equals: true, data: path3 }
path1.safeEquals("[(1,2),(3,4)]"); // { success: true, equals: false, data: Path([(1,2),(3,4)]) }
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