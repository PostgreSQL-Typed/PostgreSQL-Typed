<h1 align="center">
	@PostgreSQL-Typed/postgres
	<!-- TODO Uncomment these <br/> when using an image -->
	<!-- <br/> -->
	<!-- <br/> -->
</h1>
<blockquote align="center">
	A type-safe PostgreSQL client for Node.js (Using the <a href="https://www.npmjs.com/package/postgres">postgres</a> module)
</blockquote>
<br/>
<div align="center">
	<a href="https://www.npmjs.com/package/@postgresql-typed/postgres">
		<img src="https://img.shields.io/npm/v/@postgresql-typed/postgres.svg?logo=npm" alt="NPM Version"/>
	</a>
	<a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/actions/workflows/CI.yml">
		<img src="https://img.shields.io/github/actions/workflow/status/PostgreSQL-Typed/PostgreSQL-Typed/CI.yml?label=Test%20Package&logo=github" alt="CI Status"/>
	</a>
	<a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/tree/main/packages/postgres">
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
	Install @postgresql-typed/postgres and @postgresql-typed/cli (For generating types)
</p>

```bash
npm install --save @postgresql-typed/postgres
npm install --save-dev @postgresql-typed/cli
```

<!-- Usage -->
<h2 align="center">
	Usage
</h2>
<p align="center">
	<em>
	A documentation website is coming soon for the entire PostgreSQL-Typed ecosystem to explain how to use the system and all of its features.
	</em>
</p>

```bash
# Generate types
npx pgt gen
```

```typescript
import { Client, isReady } from "@postgresql-typed/postgres";

import { Databases, DatabasesData } from "./__generated__/index.js";

const client = await new Client<Databases>(
	DatabasesData,
	process.env.DATABASE_URI
).testConnection();

if (!isReady(client)) {
	throw new Error("Client not ready");
}

const table = client.table("<your table path>");

const result = await table.select.execute("*");
if (!result.success) {
	throw new Error("Failed to select");
}

console.log(result.data.rows);
```

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