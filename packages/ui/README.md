<h1 align="center">
	@PostgreSQL-Typed/UI
	<!-- TODO Uncomment these <br/> when using an image -->
	<!-- <br/> -->
	<!-- <br/> -->
</h1>
<blockquote align="center">
  Visualize your PostgreSQL database.
</blockquote>
<br/>
<div align="center">
	<a href="https://www.npmjs.com/package/@postgresql-typed/ui">
		<img src="https://img.shields.io/npm/v/@postgresql-typed/ui.svg?logo=npm" alt="NPM Version"/>
	</a>
	<a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/actions/workflows/CI.yml">
		<img src="https://img.shields.io/github/actions/workflow/status/PostgreSQL-Typed/PostgreSQL-Typed/CI.yml?label=Test%20Package&logo=github" alt="CI Status"/>
	</a>
	<a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/tree/main/packages/ui">
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
	Install @postgresql-typed/cli and @postgresql-typed/ui
</p>

```bash
npm install --save-dev @postgresql-typed/cli @postgresql-typed/ui
```

<!-- Usage -->
<h2 align="center">
	Usage
</h2>
<p align="center">
  Set up your project by running <code>pgt init</code> in your project directory.<br/><br/>
  <em>This will create a <code>pgt.config.ts</code> file in your current working directory.</em>
</p>

```bash
npx pgt init
```

<p align="center">
  Fill out the <code>pgt.config.ts</code> file with your database connection information.<br/><br/>
  <em>For more information on how to configure your <code>pgt.config.ts</code> file, see the <a href="https://npmjs.com/package/@postgresql-typed/cli">CLI documentation</a></em>
</p>

<p align="center">
  Start the UI by running <code>pgt ui</code> in your project directory.<br/><br/>
  <em>This will start the UI on <a href="http://localhost:3000">http://localhost:3000</a></em>
</p>

```bash
npx pgt ui
```

<!-- TODO add documentation on auth and other settings -->

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