# PostgreSQL-Caching [![Version](https://img.shields.io/npm/v/postgresql-caching.svg)](https://www.npmjs.com/package/postgresql-caching)

PostgreSQL with automatic Caching functionality using Keyv.

- [Installation](#installation)
- [Cached functions](#cached-functions)
- [Usage](#usage)
- [Main](#main)
- [With context](#with-context)
- [Data Type Supportence Status](#data-type-supportence-status)
- [Data Type Classes](#data-type-classes)
  - [Circle](#circle)

## Installation

```bash
# npm
npm install postgresql-caching

# yarn
yarn add postgresql-caching

# pnpm
pnpm i postgresql-caching
```

## Cached functions

_These functions automatically handle caching_

- select

**NOTE: When you update/insert/delete a row, the cache is not updated, you'll need to manually clear the cache using `customClass.clear()` or `customClass.keyv.clear()`, or if you know the Primary Key you can use `customClass.clearValuesWithPk(pk)` to clear all keys that have the given PK in their values`**

## Usage

### Main

```ts
import { Client } from "pg";

import PostgreSQLCaching from "postgresql-caching";

interface UserCollectionSchema {
	id: number;
	username: string;
}

class User extends PostgreSQLCaching<UserCollectionSchema> {
	create(username: string) {
		//* this.sql refers to the PG client
		return this.sql.query(
			`INSERT INTO users (username) VALUES ($1) RETURNING *`,
			[username]
		);
	}

	getUser(username: string) {
		//* Internally handles caching
		return this.select("*", { username });
	}
}

async function run() {
	const sql = new Client(
		"postgres://postgres:postgres@localhost:5432/postgres"
	);

	//Pass the PG client, schema name, table name and primary key to the constructor
	const userCollection = new User(sql, "production", "users", "id");

	await userCollection.create("Bas950");

	console.log(await userCollection.getUser("Bas950"));
}

run();
```

### With context

```ts
import { Client } from "pg";

import PostgreSQLCaching from "postgresql-caching";

interface UserCollectionSchema {
	username: string;
	ip: string;
}

interface Context {
	ip: string;
}

class User extends PostgreSQLCaching<UserCollectionSchema, Context> {
	create(username: string) {
		//* this.sql refers to the PG client
		return this.sql.query(
			`INSERT INTO users (username, ip) VALUES ($1, $2) RETURNING *`,
			[username, this.context!.ip]
		);
	}

	getUser(username: string) {
		//* Internally handles caching
		return this.select("*", { username });
	}
}

async function run() {
	const sql = new Client(
		"postgres://postgres:postgres@localhost:5432/postgres"
	);

	const userCollection = new User(sql, "production", "users", "id");

	//* Context would be set in let's say a middleware
	userCollection.setContext({ ip: "someIp" });

	await userCollection.create("Bas950");

	console.log((await userCollection.getUser("Bas950"))?.ip);
}

run();
```

## Data Type Supportence Status

<details>
<summary>Data Types</summary>
<br>
<span style="color:green">Supported</span>: Works, has automated tests on commit.<br>
<span style="color:yellow">Unknown</span>: Not tested.<br>
<span style="color:red">Unsupported</span>: Not working. Gives errors.<br>
<br>

| Data Type                    | Status                                     | Return Type             |
| ---------------------------- | ------------------------------------------ | ----------------------- |
| aclitem                      | <span style="color:yellow">Unknown</span>  | unknown                 |
| any                          | <span style="color:yellow">Unknown</span>  | unknown                 |
| anyarray                     | <span style="color:yellow">Unknown</span>  | unknown                 |
| anycompatible                | <span style="color:yellow">Unknown</span>  | unknown                 |
| anycompatiblearray           | <span style="color:yellow">Unknown</span>  | unknown                 |
| anycompatiblemultirange      | <span style="color:yellow">Unknown</span>  | unknown                 |
| anycompatiblenonarray        | <span style="color:yellow">Unknown</span>  | unknown                 |
| anycompatiblerange           | <span style="color:yellow">Unknown</span>  | unknown                 |
| anyelement                   | <span style="color:yellow">Unknown</span>  | unknown                 |
| anyenum                      | <span style="color:yellow">Unknown</span>  | unknown                 |
| anymultirange                | <span style="color:yellow">Unknown</span>  | unknown                 |
| anynonarray                  | <span style="color:yellow">Unknown</span>  | unknown                 |
| anyrange                     | <span style="color:yellow">Unknown</span>  | unknown                 |
| bigint                       | <span style="color:green">Supported</span> | [string][string]        |
| bigserial                    | <span style="color:green">Supported</span> | [string][string]        |
| bit                          | <span style="color:green">Supported</span> | [string][string]        |
| bit varying                  | <span style="color:green">Supported</span> | [string][string]        |
| bool                         | <span style="color:green">Supported</span> | [boolean][boolean]      |
| boolean                      | <span style="color:green">Supported</span> | [boolean][boolean]      |
| box                          | <span style="color:green">Supported</span> | [string][string]        |
| bpchar                       | <span style="color:green">Supported</span> | [string][string]        |
| bytea                        | <span style="color:green">Supported</span> | [Buffer][buffer]        |
| cardinal_number              | <span style="color:green">Supported</span> | [number][number]        |
| char                         | <span style="color:green">Supported</span> | [string][string]        |
| char varying                 | <span style="color:green">Supported</span> | [string][string]        |
| character                    | <span style="color:green">Supported</span> | [string][string]        |
| character varying            | <span style="color:green">Supported</span> | [string][string]        |
| character_data               | <span style="color:green">Supported</span> | [string][string]        |
| cid                          | <span style="color:green">Supported</span> | [string][string]        |
| cidr                         | <span style="color:green">Supported</span> | [string][string]        |
| circle                       | <span style="color:green">Supported</span> | [CircleObject](#circle) |
| cstring                      | <span style="color:yellow">Unknown</span>  | unknown                 |
| date                         | <span style="color:green">Supported</span> | [string][string]        |
| datemultirange               | <span style="color:green">Supported</span> | [string][string]        |
| daterange                    | <span style="color:green">Supported</span> | [string][string]        |
| decimal                      | <span style="color:green">Supported</span> | [string][string]        |
| double precision             | <span style="color:yellow">Unknown</span>  | unknown                 |
| event_trigger                | <span style="color:yellow">Unknown</span>  | unknown                 |
| fdw_handler                  | <span style="color:yellow">Unknown</span>  | unknown                 |
| float4                       | <span style="color:green">Supported</span> | [number][number]        |
| float8                       | <span style="color:green">Supported</span> | [number][number]        |
| gtsvector                    | <span style="color:yellow">Unknown</span>  | unknown                 |
| index_am_handler             | <span style="color:yellow">Unknown</span>  | unknown                 |
| inet                         | <span style="color:green">Supported</span> | [string][string]        |
| int                          | <span style="color:green">Supported</span> | [number][number]        |
| int2                         | <span style="color:green">Supported</span> | [number][number]        |
| int2vector                   | <span style="color:yellow">Unknown</span>  | unknown                 |
| int4                         | <span style="color:green">Supported</span> | [number][number]        |
| int4multirange               | <span style="color:green">Supported</span> | [string][string]        |
| int4range                    | <span style="color:green">Supported</span> | [string][string]        |
| int8                         | <span style="color:green">Supported</span> | [string][string]        |
| int8multirange               | <span style="color:green">Supported</span> | [string][string]        |
| int8range                    | <span style="color:green">Supported</span> | [string][string]        |
| integer                      | <span style="color:green">Supported</span> | [number][number]        |
| internal                     | <span style="color:yellow">Unknown</span>  | unknown                 |
| interval                     | <span style="color:yellow">Unknown</span>  | unknown                 |
| interval day                 | <span style="color:yellow">Unknown</span>  | unknown                 |
| interval day to hour         | <span style="color:yellow">Unknown</span>  | unknown                 |
| interval day to minute       | <span style="color:yellow">Unknown</span>  | unknown                 |
| interval day to second       | <span style="color:yellow">Unknown</span>  | unknown                 |
| interval hour                | <span style="color:yellow">Unknown</span>  | unknown                 |
| interval hour to minute      | <span style="color:yellow">Unknown</span>  | unknown                 |
| interval hour to second      | <span style="color:yellow">Unknown</span>  | unknown                 |
| interval minute              | <span style="color:yellow">Unknown</span>  | unknown                 |
| interval minute to second    | <span style="color:yellow">Unknown</span>  | unknown                 |
| interval month               | <span style="color:yellow">Unknown</span>  | unknown                 |
| interval second              | <span style="color:yellow">Unknown</span>  | unknown                 |
| interval year                | <span style="color:yellow">Unknown</span>  | unknown                 |
| interval year to month       | <span style="color:yellow">Unknown</span>  | unknown                 |
| json                         | <span style="color:red">Unsupported</span> | [object][object]        |
| jsonb                        | <span style="color:green">Supported</span> | [object][object]        |
| jsonpath                     | <span style="color:yellow">Unknown</span>  | unknown                 |
| language_handler             | <span style="color:yellow">Unknown</span>  | unknown                 |
| line                         | <span style="color:yellow">Unknown</span>  | unknown                 |
| lseg                         | <span style="color:yellow">Unknown</span>  | unknown                 |
| macaddr                      | <span style="color:yellow">Unknown</span>  | unknown                 |
| macaddr8                     | <span style="color:yellow">Unknown</span>  | unknown                 |
| money                        | <span style="color:green">Supported</span> | [string][string]        |
| name                         | <span style="color:green">Supported</span> | [string][string]        |
| numeric                      | <span style="color:green">Supported</span> | [string][string]        |
| nummultirange                | <span style="color:yellow">Unknown</span>  | unknown                 |
| numrange                     | <span style="color:yellow">Unknown</span>  | unknown                 |
| oid                          | <span style="color:yellow">Unknown</span>  | unknown                 |
| oidvector                    | <span style="color:yellow">Unknown</span>  | unknown                 |
| path                         | <span style="color:yellow">Unknown</span>  | unknown                 |
| pg_brin_bloom_summary        | <span style="color:yellow">Unknown</span>  | unknown                 |
| pg_brin_minmax_multi_summary | <span style="color:yellow">Unknown</span>  | unknown                 |
| pg_ddl_command               | <span style="color:yellow">Unknown</span>  | unknown                 |
| pg_dependencies              | <span style="color:yellow">Unknown</span>  | unknown                 |
| pg_lsn                       | <span style="color:yellow">Unknown</span>  | unknown                 |
| pg_mcv_list                  | <span style="color:yellow">Unknown</span>  | unknown                 |
| pg_ndistinct                 | <span style="color:yellow">Unknown</span>  | unknown                 |
| pg_node_tree                 | <span style="color:yellow">Unknown</span>  | unknown                 |
| pg_snapshot                  | <span style="color:yellow">Unknown</span>  | unknown                 |
| point                        | <span style="color:yellow">Unknown</span>  | unknown                 |
| polygon                      | <span style="color:yellow">Unknown</span>  | unknown                 |
| real                         | <span style="color:yellow">Unknown</span>  | unknown                 |
| record                       | <span style="color:yellow">Unknown</span>  | unknown                 |
| refcursor                    | <span style="color:yellow">Unknown</span>  | unknown                 |
| regclass                     | <span style="color:yellow">Unknown</span>  | unknown                 |
| regcollation                 | <span style="color:yellow">Unknown</span>  | unknown                 |
| regconfig                    | <span style="color:yellow">Unknown</span>  | unknown                 |
| regdictionary                | <span style="color:yellow">Unknown</span>  | unknown                 |
| regnamespace                 | <span style="color:yellow">Unknown</span>  | unknown                 |
| regoper                      | <span style="color:yellow">Unknown</span>  | unknown                 |
| regoperator                  | <span style="color:yellow">Unknown</span>  | unknown                 |
| regproc                      | <span style="color:yellow">Unknown</span>  | unknown                 |
| regprocedure                 | <span style="color:yellow">Unknown</span>  | unknown                 |
| regrole                      | <span style="color:yellow">Unknown</span>  | unknown                 |
| regtype                      | <span style="color:yellow">Unknown</span>  | unknown                 |
| serial                       | <span style="color:yellow">Unknown</span>  | unknown                 |
| serial2                      | <span style="color:yellow">Unknown</span>  | unknown                 |
| serial4                      | <span style="color:yellow">Unknown</span>  | unknown                 |
| serial8                      | <span style="color:yellow">Unknown</span>  | unknown                 |
| smallint                     | <span style="color:green">Supported</span> | [number][number]        |
| smallserial                  | <span style="color:yellow">Unknown</span>  | unknown                 |
| sql_identifier               | <span style="color:yellow">Unknown</span>  | unknown                 |
| table_am_handler             | <span style="color:yellow">Unknown</span>  | unknown                 |
| text                         | <span style="color:green">Supported</span> | [string][string]        |
| tid                          | <span style="color:yellow">Unknown</span>  | unknown                 |
| time                         | <span style="color:green">Supported</span> | [string][string]        |
| time with time zone          | <span style="color:green">Supported</span> | [string][string]        |
| time without time zone       | <span style="color:green">Supported</span> | [string][string]        |
| time_stamp                   | <span style="color:yellow">Unknown</span>  | unknown                 |
| timestamp                    | <span style="color:green">Supported</span> | [string][string]        |
| timestamp with time zone     | <span style="color:green">Supported</span> | [string][string]        |
| timestamp without time zone  | <span style="color:green">Supported</span> | [string][string]        |
| timestamptz                  | <span style="color:green">Supported</span> | [string][string]        |
| timetz                       | <span style="color:green">Supported</span> | [string][string]        |
| trigger                      | <span style="color:yellow">Unknown</span>  | unknown                 |
| tsm_handler                  | <span style="color:yellow">Unknown</span>  | unknown                 |
| tsmultirange                 | <span style="color:yellow">Unknown</span>  | unknown                 |
| tsquery                      | <span style="color:yellow">Unknown</span>  | unknown                 |
| tsrange                      | <span style="color:yellow">Unknown</span>  | unknown                 |
| tstzmultirange               | <span style="color:yellow">Unknown</span>  | unknown                 |
| tstzrange                    | <span style="color:yellow">Unknown</span>  | unknown                 |
| tsvector                     | <span style="color:yellow">Unknown</span>  | unknown                 |
| txid_snapshot                | <span style="color:yellow">Unknown</span>  | unknown                 |
| unknown                      | <span style="color:yellow">Unknown</span>  | unknown                 |
| uuid                         | <span style="color:green">Supported</span> | [string][string]        |
| varbit                       | <span style="color:yellow">Unknown</span>  | unknown                 |
| varchar                      | <span style="color:green">Supported</span> | [string][string]        |
| void                         | <span style="color:yellow">Unknown</span>  | unknown                 |
| xid                          | <span style="color:yellow">Unknown</span>  | unknown                 |
| xid8                         | <span style="color:yellow">Unknown</span>  | unknown                 |
| xml                          | <span style="color:yellow">Unknown</span>  | unknown                 |
| yes_or_no                    | <span style="color:yellow">Unknown</span>  | unknown                 |

</details>

## Data Type Classes

Some data types have custom classes. These classes have been defined to allow the type checking to fully work.

**NOTE: These Data Type Classes are returned as objects (`.toJSON()`) in the responses of all queries. Due to this, the default response from the [pg package][pg] my have been changed! If you want to change this back some type checking and caching could break, see the [pg-types package][pg-types] to learn how to change this back.**

### Circle

As the input of circle has to be `<(x,y),r>` (center point and radius) and the return type of the data type is an object, we have made a custom class for the data type.

```ts
import PostgreSQLCaching, { Circle, CircleObject } from "postgresql-caching";

interface CircleSchema {
	id: number;
	circle: CircleObject;
}

class Circles extends PostgreSQLCaching<CircleSchema> {
	create(circle: Circle) {
		//* this.sql refers to the PG client
		return this.sql.query(
			`INSERT INTO circles (circle) VALUES ($1) RETURNING *`,
			[circle.toString()]
		);
	}

	getCircle(circle: Circle) {
		//* Internally handles caching
		return this.select("*", { circle });
	}
}

const circle1 = Circle.from({ x: 1, y: 2, radius: 3 });
const circle2 = Circle.from("<(1,2),3>");
const circle3 = Circle.from(1, 2, 3);

const result = await Circles.getCircle(circle1);
```

Query returns the following CircleObject result if circle1 was found:

```json
{
	"x": 1,
	"y": 2,
	"radius": 3
}
```

Which is the same as the input. (`circle1.toJSON()`)

[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[buffer]: https://nodejs.org/api/buffer.html
[pg]: https://www.npmjs.com/package/pg
[pg-types]: https://www.npmjs.com/package/pg-types
