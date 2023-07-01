<h1 align="center">
	@PostgreSQL-Typed/Parsers
</h1>
<blockquote align="center">
  Parsers to convert PostgreSQL data types to TypeScript classes
</blockquote>
<br/>
<div align="center">
	<a href="https://www.npmjs.com/package/@postgresql-typed/parsers">
		<img src="https://img.shields.io/npm/v/@postgresql-typed/parsers.svg?logo=npm" alt="NPM Version"/>
	</a>
	<a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/actions/workflows/CI.yml">
		<img src="https://img.shields.io/github/actions/workflow/status/PostgreSQL-Typed/PostgreSQL-Typed/CI.yml?label=Test%20Package&logo=github" alt="CI Status"/>
	</a>
	<a href="https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/tree/main/packages/parsers">
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
	Install @postgresql-typed/parsers
</p>

```bash
npm install --save @postgresql-typed/parsers
```

<!-- Usage -->
<h2 align="center">
	Usage
</h2>
<div align="center">
  <p>
    You can find the usage examples for each type parser in their respective documentation pages.
  </p>
  <table>
    <thead>
      <tr>
        <th>Category</th>
        <th>Included Data Types</th>
      </tr>
    </thead>
    <tbody>
      <!--- Binary -->
      <tr>
        <td>
          <a href="./docs/Binary/ByteA.md">ByteA</a>
        </td>
        <td>
          <code>bytea</code><br/>
        </td>
      </tr>
      <!--- Bit String -->
      <tr>
        <td>
          <a href="./docs/BitString/BitString.md">Bit String</a>
        </td>
        <td>
          <code>bit</code><br/>
          <code>varbit</code><br/>
        </td>
      </tr>
      <!-- Boolean -->
      <tr>
        <td>
          <a href="./docs/Boolean/Boolean.md">Boolean</a>
        </td>
        <td>
          <code>bool</code><br/>
        </td>
      </tr>
      <!--- Character -->
      <tr>
        <td>
          <a href="./docs/Character/CharacterCategory.md">Character</a>
        </td>
        <td>
          <code>bpchar</code><br/>
          <code>char</code><br/>
          <code>varchar</code><br/>
          <code>name</code><br/>
          <code>text</code><br/>
        </td>
      </tr>
      <!--- Date/Time -->
      <tr>
        <td>
          <a href="./docs/DateTime/DateTime.md">Date/Time</a>
        </td>
        <td>
          <code>date</code><br/>
          <code>interval</code><br/>
          <code>time</code><br/>
          <code>timetz</code><br/>
          <code>timestamp</code><br/>
          <code>timestamptz</code><br/>
        </td>
      </tr>
      <!-- Geometric -->
      <tr>
        <td>
          <a href="./docs/Geometric/Geometric.md">Geometric</a>
        </td>
        <td>
          <code>box</code><br/>
          <code>circle</code><br/>
          <code>line</code><br/>
          <code>lseg</code><br/>
          <code>path</code><br/>
          <code>point</code><br/>
          <code>polygon</code><br/>
        </td>
      </tr>
      <!-- JSON -->
      <tr>
        <td>
          <a href="./docs/JSON/JSON.md">JSON</a>
        </td>
        <td>
          <code>json</code><br/>
          <code>jsonb</code><br/>
        </td>
      </tr>
      <!-- Monetary -->
      <tr>
        <td>
          <a href="./docs/Monetary/Money.md">Money</a>
        </td>
        <td>
          <code>money</code><br/>
        </td>
      </tr>
      <!-- Numeric -->
      <tr>
        <td>
          <a href="./docs/Numeric/Numeric.md">Numeric</a>
        </td>
        <td>
          <code>float4</code><br/>
          <code>float8</code><br/>
          <code>int2</code><br/>
          <code>int4</code><br/>
          <code>int8</code><br/>
        </td>
      </tr>
      <!-- OID -->
      <tr>
        <td>
          <a href="./docs/ObjectIdentifier/OID.md">OID</a>
        </td>
        <td>
          <code>oid</code><br/>
        </td>
      </tr>
      <!-- UUID -->
      <tr>
        <td>
          <a href="./docs/UUID/UUID.md">UUID</a>
        </td>
        <td>
          <code>uuid</code><br/>
        </td>
      </tr>
    </tbody>
  </table>
  <p>
    Range and MultiRange data types are also supported by the <a href="./docs/Ranges/Range.md">Range</a> and <a href="./docs/Ranges/MultiRange.md">MultiRange</a> parsers respectively.
  </p>
</div>

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
