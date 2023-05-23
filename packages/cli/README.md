<h1 align="center">
	@PostgreSQL-Typed/CLI
	<!-- TODO Uncomment these <br/> when using an image -->
	<!-- <br/> -->
	<!-- <br/> -->
</h1>
<blockquote align="center">
  Generate TypeScript types to be used with the <a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed">PostgreSQL-Typed</a> ecosystem from your PostgreSQL database.
</blockquote>
<br/>
<div align="center">
	<a href="https://www.npmjs.com/package/@postgresql-typed/cli">
		<img src="https://img.shields.io/npm/v/@postgresql-typed/cli.svg?logo=npm" alt="NPM Version"/>
	</a>
	<a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/actions/workflows/CI.yml">
		<img src="https://img.shields.io/github/actions/workflow/status/PostgreSQL-Typed/PostgreSQL-Typed/CI.yml?label=Test%20Package&logo=github" alt="CI Status"/>
	</a>
	<a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/tree/main/packages/cli">
		<img src="https://img.shields.io/badge/coverage-unknown-informational.svg?placeholder=$coverage-url$&logo=vitest&style=flat" alt="Coverage"/>
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
	Install @postgresql-typed/cli as a development dependency.
</p>

```bash
npm install --save-dev @postgresql-typed/cli
```

<!-- Usage -->
<h2 align="center">
	Usage
</h2>
<p align="center">
  To initialize a new configuration file for <a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed">PostgreSQL-Typed</a> in your current working directory, run <code>pgt init</code>.
</p>

```bash
npx pgt init
```

<p align="center">
  By default, this will create a <code>pgt.config.ts</code> file in your current working directory with the following contents:
</p>

```typescript
import { defineConfig } from "@postgresql-typed/cli/config";

export default defineConfig({
	cli: {
		connections: [
			process.env.DATABASE_URI
		],
	},
});
```

<p align="center">
  You can then run <code>pgt gen</code> to generate TypeScript types for your database.<br/><br/>
  <em>Make sure to set the <code>DATABASE_URI</code> environment variable to your database connection string before running this command.</em><br/>
  <em>You can use a <code>.env</code> file to set environment variables. This file will be automatically loaded by <code>pgt</code>.</em><br/><br/>
  <!-- ESM Notice -->
  <strong>NOTE:</strong> If your project uses <a href="https://nodejs.org/api/esm.html">ESM</a> modules, you will need to set the <code>cli.type</code> option to <code>"esm"</code> in your <code>pgt.config.ts</code> file.
</p>

```bash
npx pgt gen
```

<p align="center">
  By default, this will create a <code>__generated__</code> directory in your current working directory with the generated TypeScript types.
</p>

<p align="center">
  You can customize the output directory and many other options by editing the <code>pgt.config.ts</code> file. See the JSDoc comments when hovering for more information.
</p>

<p align="center">
  You can also run <code>pgt --help</code> to see a list of available commands.
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