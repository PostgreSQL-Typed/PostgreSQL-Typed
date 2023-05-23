<h1 align="center">
	@PostgreSQL-Typed/Cache
	<!-- TODO Uncomment these <br/> when using an image -->
	<!-- <br/> -->
	<!-- <br/> -->
</h1>
<blockquote align="center">
	A <a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed">PostgreSQL-Typed</a> extension to cache queries using <a href="https://www.npmjs.com/package/keyv">Keyv</a>
</blockquote>
<br/>
<div align="center">
	<a href="https://www.npmjs.com/package/@postgresql-typed/cache">
		<img src="https://img.shields.io/npm/v/@postgresql-typed/cache.svg?logo=npm" alt="NPM Version"/>
	</a>
	<a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/actions/workflows/CI.yml">
		<img src="https://img.shields.io/github/actions/workflow/status/PostgreSQL-Typed/PostgreSQL-Typed/CI.yml?label=Test%20Package&logo=github" alt="CI Status"/>
	</a>
	<a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/tree/main/packages/cache">
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
	Install @postgresql-typed/cache<br/>
	<em>(keyv is a dependency of this package, so you don't need to install it)</em>
</p>

```bash
npm install --save @postgresql-typed/cache
```
<p align="center">
	By default <a href="https://www.npmjs.com/package/keyv">Keyv</a> will store everything in memory, you can optionally also install a storage adapter.
</p>

```bash
npm install --save @keyv/redis
npm install --save @keyv/mongo
npm install --save @keyv/sqlite
npm install --save @keyv/postgres
npm install --save @keyv/mysql
npm install --save @keyv/etcd
```

<!-- Usage -->
<h2 align="center">
	Usage
</h2>
<p align="center">
	Add the <a href="https://www.npmjs.com/package/@postgresql-typed/cache">Cache</a> extension to the <code>core.extensions</code> array in your <a href="https://www.npmjs.com/package/@postgresql-typed/cli">PostgreSQL-Typed</a> configuration.<br/>
	And set any options you want to use in the <code>cache</code> object.<br/>
	<em>(All options are optional, and will use the default values if not set)</em>
</p>

```ts
// pgt.config.ts (or postgresql-typed.config.ts)

import { defineConfig } from "@postgresql-typed/cli/config";

export default defineConfig({
	core: {
		extensions: [
			"@postgresql-typed/cache",
		],
	},

	// Cache configuration (All options are optional)
	cache: {
		// The connection uri if you are using a storage adapter
		uri: process.env.CACHE_URI, // "redis://user:pass@localhost:6379"
		// The namespace to use for the cache, be default it will use "pgt"
		namespace: "my-namespace"
		// The TTL for the cache, by default it use 15 minutes (1000 * 60 * 15)
		ttl: 1000 * 60 * 15,

		// The types of queries to cache, by default it will use ["select"]
		types: ["select", "insert", "update", "delete"];
	}
});
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