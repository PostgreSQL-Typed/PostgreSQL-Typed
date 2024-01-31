import { OID } from "@postgresql-typed/oids";
import { defaultParserMappings, isAnyParser, parserToOid } from "@postgresql-typed/parsers";
import {
	createTableRelationsHelpers,
	DefaultLogger,
	DrizzleConfig,
	extractTablesRelationalConfig,
	Logger,
	RelationalSchemaConfig,
	TablesRelationalConfig,
} from "drizzle-orm";
import { NodePgClient, PgDriverOptions } from "drizzle-orm/node-postgres";
import { PgDialect, QueryResultHKT } from "drizzle-orm/pg-core";
import pg from "pg";

import { PgTDatabase } from "./database.js";
import { PgTExtensionManager } from "./extensions.js";
import { PgTSession } from "./session.js";

const { types } = pg;

export class PgTDriver {
	extensions = new PgTExtensionManager();

	constructor(
		private client: NodePgClient,
		private dialect: PgDialect,
		private options: PgDriverOptions = {}
	) {
		this.initMappers();
	}

	createSession(schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined): PgTSession<Record<string, unknown>, TablesRelationalConfig> {
		return new PgTSession(this.client, this.extensions, this, this.dialect, schema, { logger: this.options.logger });
	}

	serialize(value: unknown): string {
		if (Array.isArray(value) && value.every(element => isAnyParser(element))) {
			//* Make sure they all have the same OID, so we can just use the first one
			const oid = parserToOid(value[0], true);
			if (value.every(element => parserToOid(element, true) === oid) && oid !== OID.unknown) return defaultParserMappings[oid].serialize(value);
		}
		if (!Array.isArray(value) && isAnyParser(value)) {
			const oid = parserToOid(value);
			if (oid !== OID.unknown) return defaultParserMappings[oid].serialize(value as unknown as string);
		}

		/* c8 ignore next */
		if (Array.isArray(value)) return this.makePgArray(value);

		/* c8 ignore next */
		if (typeof value === "object" && value !== null && "postgres" in value) return value.postgres as string;
		return value as string;
	}

	/* c8 ignore next 12 */
	private makePgArray(array: any[]): string {
		return `{${array
			.map(item => {
				if (Array.isArray(item)) return this.makePgArray(item);

				if (typeof item === "object" && item !== null && "postgres" in item) item = item.postgres;
				if (typeof item === "string" && item.includes(",")) return `"${item.replaceAll('"', '\\"')}"`;

				return `${item}`;
			})
			.join(",")}}`;
	}

	initMappers(): void {
		//TODO: Update the @types/pg package to include the function
		const client = this.client as pg.Client & { setTypeParser: typeof types.setTypeParser };
		client.setTypeParser(OID.bytea as any, defaultParserMappings[OID.bytea].parse);
		client.setTypeParser(OID._bytea as any, defaultParserMappings[OID._bytea].parse);

		client.setTypeParser(OID.bit as any, defaultParserMappings[OID.bit].parse);
		client.setTypeParser(OID._bit as any, defaultParserMappings[OID._bit].parse);

		client.setTypeParser(OID.varbit as any, defaultParserMappings[OID.varbit].parse);
		client.setTypeParser(OID._varbit as any, defaultParserMappings[OID._varbit].parse);

		client.setTypeParser(OID.bool as any, defaultParserMappings[OID.bool].parse);
		client.setTypeParser(OID._bool as any, defaultParserMappings[OID._bool].parse);

		client.setTypeParser(OID.char as any, defaultParserMappings[OID.char].parse);
		client.setTypeParser(OID.bpchar as any, defaultParserMappings[OID.bpchar].parse);
		client.setTypeParser(OID._char as any, defaultParserMappings[OID._char].parse);
		client.setTypeParser(OID._bpchar as any, defaultParserMappings[OID._bpchar].parse);

		client.setTypeParser(OID.varchar as any, defaultParserMappings[OID.varchar].parse);
		client.setTypeParser(OID._varchar as any, defaultParserMappings[OID._varchar].parse);

		client.setTypeParser(OID.name as any, defaultParserMappings[OID.name].parse);
		client.setTypeParser(OID._name as any, defaultParserMappings[OID._name].parse);

		client.setTypeParser(OID.text as any, defaultParserMappings[OID.text].parse);
		client.setTypeParser(OID._text as any, defaultParserMappings[OID._text].parse);

		client.setTypeParser(OID.date as any, defaultParserMappings[OID.date].parse);
		client.setTypeParser(OID._date as any, defaultParserMappings[OID._date].parse);

		client.setTypeParser(OID.datemultirange as any, defaultParserMappings[OID.datemultirange].parse);
		client.setTypeParser(OID._datemultirange as any, defaultParserMappings[OID._datemultirange].parse);

		client.setTypeParser(OID.daterange as any, defaultParserMappings[OID.daterange].parse);
		client.setTypeParser(OID._daterange as any, defaultParserMappings[OID._daterange].parse);

		client.setTypeParser(OID.interval as any, defaultParserMappings[OID.interval].parse);
		client.setTypeParser(OID._interval as any, defaultParserMappings[OID._interval].parse);

		client.setTypeParser(OID.time as any, defaultParserMappings[OID.time].parse);
		client.setTypeParser(OID._time as any, defaultParserMappings[OID._time].parse);

		client.setTypeParser(OID.timestamp as any, defaultParserMappings[OID.timestamp].parse);
		client.setTypeParser(OID._timestamp as any, defaultParserMappings[OID._timestamp].parse);

		client.setTypeParser(OID.tsmultirange as any, defaultParserMappings[OID.tsmultirange].parse);
		client.setTypeParser(OID._tsmultirange as any, defaultParserMappings[OID._tsmultirange].parse);

		client.setTypeParser(OID.tsrange as any, defaultParserMappings[OID.tsrange].parse);
		client.setTypeParser(OID._tsrange as any, defaultParserMappings[OID._tsrange].parse);

		client.setTypeParser(OID.timestamptz as any, defaultParserMappings[OID.timestamptz].parse);
		client.setTypeParser(OID._timestamptz as any, defaultParserMappings[OID._timestamptz].parse);

		client.setTypeParser(OID.tstzmultirange as any, defaultParserMappings[OID.tstzmultirange].parse);
		client.setTypeParser(OID._tstzmultirange as any, defaultParserMappings[OID._tstzmultirange].parse);

		client.setTypeParser(OID.tstzrange as any, defaultParserMappings[OID.tstzrange].parse);
		client.setTypeParser(OID._tstzrange as any, defaultParserMappings[OID._tstzrange].parse);

		client.setTypeParser(OID.timetz as any, defaultParserMappings[OID.timetz].parse);
		client.setTypeParser(OID._timetz as any, defaultParserMappings[OID._timetz].parse);

		client.setTypeParser(OID.box as any, defaultParserMappings[OID.box].parse);
		client.setTypeParser(OID._box as any, defaultParserMappings[OID._box].parse);

		client.setTypeParser(OID.circle as any, defaultParserMappings[OID.circle].parse);
		client.setTypeParser(OID._circle as any, defaultParserMappings[OID._circle].parse);

		client.setTypeParser(OID.line as any, defaultParserMappings[OID.line].parse);
		client.setTypeParser(OID._line as any, defaultParserMappings[OID._line].parse);

		client.setTypeParser(OID.lseg as any, defaultParserMappings[OID.lseg].parse);
		client.setTypeParser(OID._lseg as any, defaultParserMappings[OID._lseg].parse);

		client.setTypeParser(OID.path as any, defaultParserMappings[OID.path].parse);
		client.setTypeParser(OID._path as any, defaultParserMappings[OID._path].parse);

		client.setTypeParser(OID.point as any, defaultParserMappings[OID.point].parse);
		client.setTypeParser(OID._point as any, defaultParserMappings[OID._point].parse);

		client.setTypeParser(OID.polygon as any, defaultParserMappings[OID.polygon].parse);
		client.setTypeParser(OID._polygon as any, defaultParserMappings[OID._polygon].parse);

		client.setTypeParser(OID.json as any, defaultParserMappings[OID.json].parse);
		client.setTypeParser(OID._json as any, defaultParserMappings[OID._json].parse);

		client.setTypeParser(OID.jsonb as any, defaultParserMappings[OID.jsonb].parse);
		client.setTypeParser(OID._jsonb as any, defaultParserMappings[OID._jsonb].parse);

		client.setTypeParser(OID.money as any, defaultParserMappings[OID.money].parse);
		client.setTypeParser(OID._money as any, defaultParserMappings[OID._money].parse);

		client.setTypeParser(OID.float4 as any, defaultParserMappings[OID.float4].parse);
		client.setTypeParser(OID._float4 as any, defaultParserMappings[OID._float4].parse);

		client.setTypeParser(OID.float8 as any, defaultParserMappings[OID.float8].parse);
		client.setTypeParser(OID._float8 as any, defaultParserMappings[OID._float8].parse);

		client.setTypeParser(OID.int2 as any, defaultParserMappings[OID.int2].parse);
		client.setTypeParser(OID._int2 as any, defaultParserMappings[OID._int2].parse);

		client.setTypeParser(OID.int4 as any, defaultParserMappings[OID.int4].parse);
		client.setTypeParser(OID._int4 as any, defaultParserMappings[OID._int4].parse);

		client.setTypeParser(OID.int4multirange as any, defaultParserMappings[OID.int4multirange].parse);
		client.setTypeParser(OID._int4multirange as any, defaultParserMappings[OID._int4multirange].parse);

		client.setTypeParser(OID.int4range as any, defaultParserMappings[OID.int4range].parse);
		client.setTypeParser(OID._int4range as any, defaultParserMappings[OID._int4range].parse);

		client.setTypeParser(OID.int8 as any, defaultParserMappings[OID.int8].parse);
		client.setTypeParser(OID._int8 as any, defaultParserMappings[OID._int8].parse);

		client.setTypeParser(OID.int8multirange as any, defaultParserMappings[OID.int8multirange].parse);
		client.setTypeParser(OID._int8multirange as any, defaultParserMappings[OID._int8multirange].parse);

		client.setTypeParser(OID.int8range as any, defaultParserMappings[OID.int8range].parse);
		client.setTypeParser(OID._int8range as any, defaultParserMappings[OID._int8range].parse);

		client.setTypeParser(OID.oid as any, defaultParserMappings[OID.oid].parse);
		client.setTypeParser(OID._oid as any, defaultParserMappings[OID._oid].parse);

		client.setTypeParser(OID.uuid as any, defaultParserMappings[OID.uuid].parse);
		client.setTypeParser(OID._uuid as any, defaultParserMappings[OID._uuid].parse);
	}
}

export function pgt<TSchema extends Record<string, unknown> = Record<string, never>>(
	client: NodePgClient,
	config: DrizzleConfig<TSchema> = {}
): PgTDatabase<QueryResultHKT, TSchema> {
	const dialect = new PgDialect();
	let logger: Logger | undefined;
	/* c8 ignore next */
	if (config.logger === true) logger = new DefaultLogger();
	else if (config.logger !== false) ({ logger } = config);

	let schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined;
	/* c8 ignore next 8 */
	if (config.schema) {
		const tablesConfig = extractTablesRelationalConfig(config.schema, createTableRelationsHelpers);
		schema = {
			fullSchema: config.schema,
			schema: tablesConfig.tables,
			tableNamesMap: tablesConfig.tableNamesMap,
		};
	}

	const driver = new PgTDriver(client, dialect, { logger }),
		session = driver.createSession(schema);
	return new PgTDatabase(dialect, session, schema) as PgTDatabase<QueryResultHKT, TSchema>;
}
