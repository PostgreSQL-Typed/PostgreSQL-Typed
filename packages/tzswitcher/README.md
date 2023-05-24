<h1 align="center">
	@PostgreSQL-Typed/TzSwitcher
	<!-- TODO Uncomment these <br/> when using an image -->
	<!-- <br/> -->
	<!-- <br/> -->
</h1>
<blockquote align="center">
	A <a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed">PostgreSQL-Typed</a> extension to switch the timezone of a column from one to another
</blockquote>
<br/>
<div align="center">
	<a href="https://www.npmjs.com/package/@postgresql-typed/tzswitcher">
		<img src="https://img.shields.io/npm/v/@postgresql-typed/tzswitcher.svg?logo=npm" alt="NPM Version"/>
	</a>
	<a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/actions/workflows/CI.yml">
		<img src="https://img.shields.io/github/actions/workflow/status/PostgreSQL-Typed/PostgreSQL-Typed/CI.yml?label=Test%20Package&logo=github" alt="CI Status"/>
	</a>
	<a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/tree/main/packages/tzswitcher">
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
	Install @postgresql-typed/tzswitcher
</p>

```bash
npm install --save @postgresql-typed/tzswitcher
```

<!-- Usage -->
<h2 align="center">
	Usage
</h2>
<p align="center">
	Add the <a href="https://www.npmjs.com/package/@postgresql-typed/tzswitcher">TzSwitcher</a> extension to the <code>core.extensions</code> array in your <a href="https://www.npmjs.com/package/@postgresql-typed/cli">PostgreSQL-Typed</a> configuration.<br/>
	And set any options you want to use in the <code>tzswitcher</code> object.<br/>
	<em>(All options are optional, and will use the default values if not set)</em>
	<br/>
	<br/>
	<strong>NOTE:</strong> You most likely want to put this extension at the start of the array, so that it is run before any other extensions.
</p>

```ts
// pgt.config.ts (or postgresql-typed.config.ts)

import { defineConfig } from "@postgresql-typed/cli/config";

export default defineConfig({
	core: {
		extensions: [
			"@postgresql-typed/tzswitcher",
		],
	},

	// TzSwitcher configuration (All options are optional)
	// By default, all the from/to objects are set to false (meaning they won't be switched)
	tzswitcher: {
		// timestamp/timestamptz/time/timetz columns
		timestamp: {
			from: "UTC", // The timezone that is stored in the database
			to: "Asia/Seoul", // The timezone that you want to switch to locally
		},
		timestamptz: false, // Disable timestamptz switching
		time: {
			from: "UTC",
			to: "Asia/Seoul",
		},
		timetz: false,
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