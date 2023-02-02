# PostgreSQL-Data-Types [![Version](https://img.shields.io/npm/v/postgresql-data-types.svg)](https://www.npmjs.com/package/postgresql-data-types)

A list of PostgreSQL data types

- [Installation](#installation)
- [Usage](#usage)

## Installation

```bash
# npm
npm install postgresql-data-types

# yarn
yarn add postgresql-data-types

# pnpm
pnpm i postgresql-data-types
```

## Usage

```ts
import { DataType, DataTypes } from "postgresql-data-types";

console.log(DataType.uuid); // 2950

let datatype: DataTypes = "uuid"; // Has autocomplete when using DataTypes as the TypeScript type

console.log(DataType[datatype]); // 2950
```
