# @postgresql-typed/core

## 0.7.1

### Patch Changes

- [`2162c8c`](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/commit/2162c8c01c68a0e6540fe804e2d3dd891931ed2c) Thanks [@Bas950](https://github.com/Bas950)! - add provenance

- [`165d3e8`](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/commit/165d3e8a17e1eb09bfb90359377e18cb8f15643c) Thanks [@Bas950](https://github.com/Bas950)! - make count optional for count(\*)

- [#54](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/pull/54) [`f365d6f`](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/commit/f365d6f5ccc22a69db3db044676ff8c5d3c72edf) Thanks [@Bas950](https://github.com/Bas950)! - Import Buffer from 'node:buffer'

- Updated dependencies [[`2162c8c`](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/commit/2162c8c01c68a0e6540fe804e2d3dd891931ed2c), [`f365d6f`](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/commit/f365d6f5ccc22a69db3db044676ff8c5d3c72edf)]:
  - @postgresql-typed/parsers@0.8.2
  - @postgresql-typed/oids@0.1.3
  - @postgresql-typed/util@0.6.2

## 0.7.0

### Minor Changes

- [`49e363e`](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/commit/49e363eb1c1e0f87ebadec514522ab467cf8288c) Thanks [@Bas950](https://github.com/Bas950)! - add some more operators (extract)

## 0.6.0

### Minor Changes

- [`ccceddf`](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/commit/ccceddf41cac568d856ace78082160a3614adf4a) Thanks [@Bas950](https://github.com/Bas950)! - Add new operators

  - `isNull`
  - `isNotNull`
  - `asc`
  - `desc`
  - `exists`
  - `notExists`

  Remove the `in` operator, as it is a reserved variable in TypeScript.

### Patch Changes

- Updated dependencies [[`f41ba0b`](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/commit/f41ba0b1a93fb86577297384589b2c928adc9c29)]:
  - @postgresql-typed/util@0.6.1
  - @postgresql-typed/parsers@0.8.1

## 0.5.1

### Patch Changes

- [`fb24727`](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/commit/fb24727a22126012c8d884735c03f8eec4791315) Thanks [@Bas950](https://github.com/Bas950)! - Add support for ByteA

- Updated dependencies [[`d2f306c`](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/commit/d2f306cb908d86d4615195949f9fbcb1e8ab0e97), [`141cf8e`](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/commit/141cf8e9c17cdb91ab1c9f5461065c0b3b75e48c), [`fb24727`](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/commit/fb24727a22126012c8d884735c03f8eec4791315)]:
  - @postgresql-typed/util@0.6.0
  - @postgresql-typed/parsers@0.8.0

## 0.5.0

### Minor Changes

- [#43](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/pull/43) [`55e2013`](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/commit/55e201338a0283bfee5208bbc07bf7613a00f8f9) Thanks [@Bas950](https://github.com/Bas950)! - pgt is now based on drizzle-orm

### Patch Changes

- Updated dependencies [[`55e2013`](https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/commit/55e201338a0283bfee5208bbc07bf7613a00f8f9)]:
  - @postgresql-typed/parsers@0.7.0
  - @postgresql-typed/util@0.5.0
