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
import { PgDialect } from "drizzle-orm/pg-core";
import pg from "pg";

import { PgTDatabase } from "./database.js";
import { PgTExtensionManager } from "./extensions.js";
import { PgTSession } from "./session.js";

const { types } = pg;

export class PgTDriver {
	extensions = new PgTExtensionManager();

	constructor(private client: NodePgClient, private dialect: PgDialect, private options: PgDriverOptions = {}) {
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
		types.setTypeParser(OID.bit as any, defaultParserMappings[OID.bit].parse);
		types.setTypeParser(OID._bit as any, defaultParserMappings[OID._bit].parse);

		types.setTypeParser(OID.varbit as any, defaultParserMappings[OID.varbit].parse);
		types.setTypeParser(OID._varbit as any, defaultParserMappings[OID._varbit].parse);

		types.setTypeParser(OID.bool as any, defaultParserMappings[OID.bool].parse);
		types.setTypeParser(OID._bool as any, defaultParserMappings[OID._bool].parse);

		types.setTypeParser(OID.char as any, defaultParserMappings[OID.char].parse);
		types.setTypeParser(OID.bpchar as any, defaultParserMappings[OID.bpchar].parse);
		types.setTypeParser(OID._char as any, defaultParserMappings[OID._char].parse);
		types.setTypeParser(OID._bpchar as any, defaultParserMappings[OID._bpchar].parse);

		types.setTypeParser(OID.varchar as any, defaultParserMappings[OID.varchar].parse);
		types.setTypeParser(OID._varchar as any, defaultParserMappings[OID._varchar].parse);

		types.setTypeParser(OID.name as any, defaultParserMappings[OID.name].parse);
		types.setTypeParser(OID._name as any, defaultParserMappings[OID._name].parse);

		types.setTypeParser(OID.text as any, defaultParserMappings[OID.text].parse);
		types.setTypeParser(OID._text as any, defaultParserMappings[OID._text].parse);

		types.setTypeParser(OID.date as any, defaultParserMappings[OID.date].parse);
		types.setTypeParser(OID._date as any, defaultParserMappings[OID._date].parse);

		types.setTypeParser(OID.datemultirange as any, defaultParserMappings[OID.datemultirange].parse);
		types.setTypeParser(OID._datemultirange as any, defaultParserMappings[OID._datemultirange].parse);

		types.setTypeParser(OID.daterange as any, defaultParserMappings[OID.daterange].parse);
		types.setTypeParser(OID._daterange as any, defaultParserMappings[OID._daterange].parse);

		types.setTypeParser(OID.interval as any, defaultParserMappings[OID.interval].parse);
		types.setTypeParser(OID._interval as any, defaultParserMappings[OID._interval].parse);

		types.setTypeParser(OID.time as any, defaultParserMappings[OID.time].parse);
		types.setTypeParser(OID._time as any, defaultParserMappings[OID._time].parse);

		types.setTypeParser(OID.timestamp as any, defaultParserMappings[OID.timestamp].parse);
		types.setTypeParser(OID._timestamp as any, defaultParserMappings[OID._timestamp].parse);

		types.setTypeParser(OID.tsmultirange as any, defaultParserMappings[OID.tsmultirange].parse);
		types.setTypeParser(OID._tsmultirange as any, defaultParserMappings[OID._tsmultirange].parse);

		types.setTypeParser(OID.tsrange as any, defaultParserMappings[OID.tsrange].parse);
		types.setTypeParser(OID._tsrange as any, defaultParserMappings[OID._tsrange].parse);

		types.setTypeParser(OID.timestamptz as any, defaultParserMappings[OID.timestamptz].parse);
		types.setTypeParser(OID._timestamptz as any, defaultParserMappings[OID._timestamptz].parse);

		types.setTypeParser(OID.tstzmultirange as any, defaultParserMappings[OID.tstzmultirange].parse);
		types.setTypeParser(OID._tstzmultirange as any, defaultParserMappings[OID._tstzmultirange].parse);

		types.setTypeParser(OID.tstzrange as any, defaultParserMappings[OID.tstzrange].parse);
		types.setTypeParser(OID._tstzrange as any, defaultParserMappings[OID._tstzrange].parse);

		types.setTypeParser(OID.timetz as any, defaultParserMappings[OID.timetz].parse);
		types.setTypeParser(OID._timetz as any, defaultParserMappings[OID._timetz].parse);

		types.setTypeParser(OID.box as any, defaultParserMappings[OID.box].parse);
		types.setTypeParser(OID._box as any, defaultParserMappings[OID._box].parse);

		types.setTypeParser(OID.circle as any, defaultParserMappings[OID.circle].parse);
		types.setTypeParser(OID._circle as any, defaultParserMappings[OID._circle].parse);

		types.setTypeParser(OID.line as any, defaultParserMappings[OID.line].parse);
		types.setTypeParser(OID._line as any, defaultParserMappings[OID._line].parse);

		types.setTypeParser(OID.lseg as any, defaultParserMappings[OID.lseg].parse);
		types.setTypeParser(OID._lseg as any, defaultParserMappings[OID._lseg].parse);

		types.setTypeParser(OID.path as any, defaultParserMappings[OID.path].parse);
		types.setTypeParser(OID._path as any, defaultParserMappings[OID._path].parse);

		types.setTypeParser(OID.point as any, defaultParserMappings[OID.point].parse);
		types.setTypeParser(OID._point as any, defaultParserMappings[OID._point].parse);

		types.setTypeParser(OID.polygon as any, defaultParserMappings[OID.polygon].parse);
		types.setTypeParser(OID._polygon as any, defaultParserMappings[OID._polygon].parse);

		types.setTypeParser(OID.json as any, defaultParserMappings[OID.json].parse);
		types.setTypeParser(OID._json as any, defaultParserMappings[OID._json].parse);

		types.setTypeParser(OID.jsonb as any, defaultParserMappings[OID.jsonb].parse);
		types.setTypeParser(OID._jsonb as any, defaultParserMappings[OID._jsonb].parse);

		types.setTypeParser(OID.money as any, defaultParserMappings[OID.money].parse);
		types.setTypeParser(OID._money as any, defaultParserMappings[OID._money].parse);

		types.setTypeParser(OID.float4 as any, defaultParserMappings[OID.float4].parse);
		types.setTypeParser(OID._float4 as any, defaultParserMappings[OID._float4].parse);

		types.setTypeParser(OID.float8 as any, defaultParserMappings[OID.float8].parse);
		types.setTypeParser(OID._float8 as any, defaultParserMappings[OID._float8].parse);

		types.setTypeParser(OID.int2 as any, defaultParserMappings[OID.int2].parse);
		types.setTypeParser(OID._int2 as any, defaultParserMappings[OID._int2].parse);

		types.setTypeParser(OID.int4 as any, defaultParserMappings[OID.int4].parse);
		types.setTypeParser(OID._int4 as any, defaultParserMappings[OID._int4].parse);

		types.setTypeParser(OID.int4multirange as any, defaultParserMappings[OID.int4multirange].parse);
		types.setTypeParser(OID._int4multirange as any, defaultParserMappings[OID._int4multirange].parse);

		types.setTypeParser(OID.int4range as any, defaultParserMappings[OID.int4range].parse);
		types.setTypeParser(OID._int4range as any, defaultParserMappings[OID._int4range].parse);

		types.setTypeParser(OID.int8 as any, defaultParserMappings[OID.int8].parse);
		types.setTypeParser(OID._int8 as any, defaultParserMappings[OID._int8].parse);

		types.setTypeParser(OID.int8multirange as any, defaultParserMappings[OID.int8multirange].parse);
		types.setTypeParser(OID._int8multirange as any, defaultParserMappings[OID._int8multirange].parse);

		types.setTypeParser(OID.int8range as any, defaultParserMappings[OID.int8range].parse);
		types.setTypeParser(OID._int8range as any, defaultParserMappings[OID._int8range].parse);

		types.setTypeParser(OID.oid as any, defaultParserMappings[OID.oid].parse);
		types.setTypeParser(OID._oid as any, defaultParserMappings[OID._oid].parse);

		types.setTypeParser(OID.uuid as any, defaultParserMappings[OID.uuid].parse);
		types.setTypeParser(OID._uuid as any, defaultParserMappings[OID._uuid].parse);
	}
}

export function pgt<TSchema extends Record<string, unknown> = Record<string, never>>(
	client: NodePgClient,
	config: DrizzleConfig<TSchema> = {}
): PgTDatabase<TSchema> {
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
	return new PgTDatabase(dialect, session, schema) as PgTDatabase<TSchema>;
}
