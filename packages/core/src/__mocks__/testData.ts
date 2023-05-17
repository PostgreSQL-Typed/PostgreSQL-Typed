import {
	CharacterVarying,
	CharacterVaryingConstructor,
	PgTPParser,
	PgTPParserClass,
	Text,
	TextConstructor,
	UUID,
	UUIDConstructor,
} from "@postgresql-typed/parsers";

export type TestData = {
	db1: {
		name: "db1";
		schemas: {
			schema1: {
				name: "schema1";
				tables: {
					table1: {
						name: "table1";
						primary_key: "id";
						columns: {
							id: UUID;
						};
						insert_parameters: {
							id: UUID;
						};
					};
					table2: {
						name: "table2";
						primary_key: "id";
						columns: {
							id: UUID;
						};
						insert_parameters: {
							id: UUID;
						};
					};
				};
			};
			schema2: {
				name: "schema2";
				tables: {
					table3: {
						name: "table3";
						primary_key: "id";
						columns: {
							id: UUID;
						};
						insert_parameters: {
							id: UUID;
						};
					};
				};
			};
		};
	};
	db2: {
		name: "db2";
		schemas: {
			schema3: {
				name: "schema3";
				tables: {
					table4: {
						name: "table4";
						primary_key: "id";
						columns: {
							id: UUID;
							text: Text;
						};
						insert_parameters: {
							id: UUID;
							text: Text;
						};
					};
					table5: {
						name: "table5";
						primary_key: "id";
						columns: {
							id: UUID;
							not_uuid: CharacterVarying<36>;
						};
						insert_parameters: {
							id: UUID;
							not_uuid: CharacterVarying<36>;
						};
					};
				};
			};
		};
	};
};

export const testData = {
	db1: {
		name: "db1" as const,
		schemas: [
			{
				name: "schema1" as const,
				tables: [
					{
						name: "table1" as const,
						primary_key: "id" as const,
						columns: {
							id: PgTPParser(UUID) as PgTPParserClass<UUIDConstructor>,
						},
						insert_parameters: {
							id: PgTPParser(UUID).optional() as PgTPParserClass<UUIDConstructor>,
						},
					},
					{
						name: "table2" as const,
						primary_key: "id" as const,
						columns: {
							id: PgTPParser(UUID) as PgTPParserClass<UUIDConstructor>,
						},
						insert_parameters: {
							id: PgTPParser(UUID).optional() as PgTPParserClass<UUIDConstructor>,
						},
					},
				],
			},
			{
				name: "schema2" as const,
				tables: [
					{
						name: "table3" as const,
						primary_key: "id" as const,
						columns: {
							id: PgTPParser(UUID) as PgTPParserClass<UUIDConstructor>,
						},
						insert_parameters: {
							id: PgTPParser(UUID).optional() as PgTPParserClass<UUIDConstructor>,
						},
					},
				],
			},
		],
	},
	db2: {
		name: "db2" as const,
		schemas: [
			{
				name: "schema3" as const,
				tables: [
					{
						name: "table4" as const,
						primary_key: "id" as const,
						columns: {
							id: PgTPParser(UUID) as PgTPParserClass<UUIDConstructor>,
							text: PgTPParser(Text) as PgTPParserClass<TextConstructor>,
						},
						insert_parameters: {
							id: PgTPParser(UUID).optional() as PgTPParserClass<UUIDConstructor>,
							text: PgTPParser(Text).optional() as PgTPParserClass<TextConstructor>,
						},
					},
					{
						name: "table5" as const,
						primary_key: "id" as const,
						columns: {
							id: PgTPParser(UUID) as PgTPParserClass<UUIDConstructor>,
							not_uuid: PgTPParser(CharacterVarying.setN(36)) as PgTPParserClass<CharacterVaryingConstructor<36>>,
						},
						insert_parameters: {
							id: PgTPParser(UUID).optional() as PgTPParserClass<UUIDConstructor>,
							not_uuid: PgTPParser(CharacterVarying.setN(36)).optional() as PgTPParserClass<CharacterVaryingConstructor<36>>,
						},
					},
				],
			},
		],
	},
};

export const createSchemaQueryDatabase1 = `
CREATE SCHEMA IF NOT EXISTS "schema1";
CREATE SCHEMA IF NOT EXISTS "schema2";
`;

export const dropSchemaQueryDatabase1 = `
DROP SCHEMA IF EXISTS "schema1" CASCADE;
DROP SCHEMA IF EXISTS "schema2" CASCADE;
`;

export const createTableQueryDatabase1 = `
CREATE TABLE IF NOT EXISTS "schema1"."table1" (
	"id" UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS "schema1"."table2" (
	"id" UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS "schema2"."table3" (
	"id" UUID NOT NULL
);
`;

export const createSchemaQueryDatabase2 = `
CREATE SCHEMA IF NOT EXISTS "schema3";
`;

export const dropSchemaQueryDatabase2 = `
DROP SCHEMA IF EXISTS "schema3" CASCADE;
`;

export const createTableQueryDatabase2 = `
CREATE TABLE IF NOT EXISTS "schema3"."table4" (
	"id" UUID NOT NULL,
	text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "schema3"."table5" (
	"id" UUID NOT NULL,
	"not_uuid" CHARACTER VARYING(36) NOT NULL
);
`;

export const insertQueryDatabase2T4 = `
INSERT INTO "schema3"."table4" ("id", "text") VALUES ($1, $2);
`;

export const insertQueryDatabase2T5 = `
INSERT INTO "schema3"."table5" ("id", "not_uuid") VALUES ($1, $2);
`;

export const clearTableQueryDatabase2 = `
DELETE FROM "schema3"."table5";
`;
