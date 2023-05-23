<h1 align="center">
	@PostgreSQL-Typed/OIDs
	<!-- TODO Uncomment these <br/> when using an image -->
	<!-- <br/> -->
	<!-- <br/> -->
</h1>
<blockquote align="center">
  A collection of the PostgreSQL OIDs (Object Identifiers) for all of the built-in data types.
</blockquote>
<br/>
<div align="center">
	<a href="https://www.npmjs.com/package/@postgresql-typed/oids">
		<img src="https://img.shields.io/npm/v/@postgresql-typed/oids.svg?logo=npm" alt="NPM Version"/>
	</a>
	<a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/actions/workflows/CI.yml">
		<img src="https://img.shields.io/github/actions/workflow/status/PostgreSQL-Typed/PostgreSQL-Typed/CI.yml?label=Test%20Package&logo=github" alt="CI Status"/>
	</a>
	<a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/tree/main/packages/oids">
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
	Install @postgresql-typed/oids
</p>

```bash
npm install --save @postgresql-typed/oids
```

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { OID, OIDs } from "@postgresql-typed/oids";

console.log(OID.uuid); // 2950

let oid: OIDs = "uuid"; // Has autocomplete when using OIDs as the TypeScript type

console.log(OID[oid]); // 2950
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
