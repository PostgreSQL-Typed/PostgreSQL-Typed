import { PGTPParser, PGTPParserClass, UUID, UUIDConstructor } from "@postgresql-typed/parsers";

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
						};
						insert_parameters: {
							id: UUID;
						};
					};
					table5: {
						name: "table5";
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
							id: PGTPParser(UUID) as PGTPParserClass<UUIDConstructor>,
						},
						insert_parameters: {
							id: PGTPParser(UUID).optional() as PGTPParserClass<UUIDConstructor>,
						},
					},
					{
						name: "table2" as const,
						primary_key: "id" as const,
						columns: {
							id: PGTPParser(UUID) as PGTPParserClass<UUIDConstructor>,
						},
						insert_parameters: {
							id: PGTPParser(UUID).optional() as PGTPParserClass<UUIDConstructor>,
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
							id: PGTPParser(UUID) as PGTPParserClass<UUIDConstructor>,
						},
						insert_parameters: {
							id: PGTPParser(UUID).optional() as PGTPParserClass<UUIDConstructor>,
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
							id: PGTPParser(UUID) as PGTPParserClass<UUIDConstructor>,
						},
						insert_parameters: {
							id: PGTPParser(UUID).optional() as PGTPParserClass<UUIDConstructor>,
						},
					},
					{
						name: "table5" as const,
						primary_key: "id" as const,
						columns: {
							id: PGTPParser(UUID) as PGTPParserClass<UUIDConstructor>,
						},
						insert_parameters: {
							id: PGTPParser(UUID).optional() as PGTPParserClass<UUIDConstructor>,
						},
					},
				],
			},
		],
	},
};