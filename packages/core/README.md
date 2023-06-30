<h1 align="center">
	@PostgreSQL-Typed/Core
	<!-- TODO Uncomment these <br/> when using an image -->
	<!-- <br/> -->
	<!-- <br/> -->
</h1>
<blockquote align="center">
	A type-safe PostgreSQL client for Node.js
</blockquote>
<br/>
<div align="center">
	<a href="https://www.npmjs.com/package/@postgresql-typed/core">
		<img src="https://img.shields.io/npm/v/@postgresql-typed/core.svg?logo=npm" alt="NPM Version"/>
	</a>
	<a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/actions/workflows/CI.yml">
		<img src="https://img.shields.io/github/actions/workflow/status/PostgreSQL-Typed/PostgreSQL-Typed/CI.yml?label=Test%20Package&logo=github" alt="CI Status"/>
	</a>
	<a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/tree/main/packages/core">
		<img src="https://img.shields.io/badge/coverage-100%25-success.svg?placeholder=$coverage-url$&logo=vitest&style=flat" alt="Coverage"/>
	</a>
</div>
<details align="center">
	<summary>Table of Contents</summary>
	<a href="#installation">Installation</a><br/>
	<a href="#usage">Usage</a><br/>
  <a href="#ecosystem">Ecosystem</a><br/>
	<a href="#license">License</a><br/>
</details>
<br/>

<!-- Installation -->
<h2 align="center">
	Installation
</h2>

<p align="center">
	Install @postgresql-typed/core
</p>

```bash
npm install --save @postgresql-typed/core
```

<!-- Usage -->
<h2 align="center">
	Usage
</h2>
<p align="center">
	This package is build on top of <a href="https://www.npmjs.com/package/drizzle-orm">drizzle-orm</a>, which is a type-safe ORM for Node.js.<br/>
	For more information on how to use this package, please refer to the <a href="https://www.npmjs.com/package/drizzle-orm">drizzle-orm documentation</a>.<br/>
	Differences between drizzle-orm and @postgresql-typed/core are listed below.
</p>

```ts
import { Client, pgt, table } from "@postgresql-typed/core";
import {
	defineCharacterVarying,
	defineInt2,
	defineUUID
} from "@postgresql-typed/core/definers";
import { eq } from "@postgresql-typed/core/operators";

const db = pgt(new Client({
	connectionString: "postgres://user:pass@localhost:5432/dbname"
}));

await db.connect();

const users = table("users", {
	id: defineUUID("user_id").primaryKey(),
	name: defineCharacterVarying("user_name", {
		length: 255
	}).notNull(),
	age: defineInt2("user_age").notNull()
});

await db.select().from(users).where(eq(users.age, 18));
```

<p align="center">
	There is no need to install <a href="https://www.npmjs.com/package/pg">pg</a>, nor <a href="https://www.npmjs.com/package/drizzle-orm">drizzle-orm</a> as they are both dependencies of this package.<br/>
	However, you will need to install <a href="https://www.npmjs.com/package/@postgresql-typed/cli">@postgresql-typed/cli</a> if you want to use the CLI to generate the table definitions.
</p>

<!-- Ecosystem -->
<h2 align="center">
	Ecosystem
</h2>
<div align="center">
	<p>
		<a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed">
			<picture>
				<source media="(prefers-color-scheme: dark)" srcset="https://cdn.rcd.gg/PostgreSQL-Typed-Banner-White.svg">
				<source media="(prefers-color-scheme: light)" srcset="https://cdn.rcd.gg/PostgreSQL-Typed-Banner-Black.svg">
				<img width="75%" alt="PostgreSQL-Typed" src="https://cdn.rcd.gg/PostgreSQL-Typed-Banner-Black.svg"/>
			</picture>
		</a>
	</p>
</div>
<p align="center">
  This package is part of the <a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed">PostgreSQL-Typed</a> ecosystem.
</p>

<!-- License -->
<h2 align="center">
	License
</h2>
<p align="center">
	<a href="https://www.mozilla.org/en-US/MPL/2.0/">
		Mozilla Public License 2.0
	</a>
</p>