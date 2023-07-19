/* eslint-disable no-console */
import type { Connection, PostgreSQLTypedCLIConfig } from "@postgresql-typed/util";
import pg from "pg";

import type { ProgressBar } from "../classes/ProgressBar.js";
import { GenerateArguments } from "../commands/Generate.js";
import { ClassKind } from "../types/enums/ClassKind.js";
import type { Attribute } from "../types/interfaces/Attribute.js";
import type { Class } from "../types/interfaces/Class.js";
import type { ClassDetails } from "../types/interfaces/ClassDetails.js";
import type { Constraint } from "../types/interfaces/Constraint.js";
import type { FetchedData } from "../types/interfaces/FetchedData.js";
import type { Table } from "../types/interfaces/Table.js";
import type { DataType } from "../types/types/DataType.js";
import { r } from "../util/chalk.js";
import { LOGGER } from "../util/constants.js";
import { getAttributes } from "../util/functions/getters/getAttributes.js";
import { getClasses } from "../util/functions/getters/getClasses.js";
import { getConsoleHeader } from "../util/functions/getters/getConsoleHeader.js";
import { getConstraints } from "../util/functions/getters/getConstraints.js";
import { getDataTypes } from "../util/functions/getters/getDataTypes.js";
import { getTables } from "../util/functions/getters/getTables.js";

export class Fetcher {
	private client: pg.Client;
	private dbName = "";
	private tables: Table[] = [];
	private dataTypes: DataType[] = [];
	private classes: Class[] = [];
	private attributes: Attribute[] = [];
	private constraints: Constraint[] = [];
	private LOGGER = LOGGER?.extend("Fetcher");
	constructor(
		private readonly config: PostgreSQLTypedCLIConfig,
		private readonly progressBar: ProgressBar,
		private readonly connection: string | Connection,
		private readonly generatorConfig?: GenerateArguments<boolean>
	) {
		this.client = new pg.Client({
			connectionString: this.formatted_connection_string,
			ssl: { rejectUnauthorized: false },
		});
	}

	public async connect(): Promise<void> {
		try {
			await this.client.connect();
			await this.setDatabaseName();
		} catch {
			this.progressBar.stop();
			if (this.generatorConfig?.silent !== true)
				console.log(getConsoleHeader(r("Could not connect to database!"), "Please check your connection settings.", false, `Remote host: ${this.hostPort}`));

			if (this.generatorConfig?.onError === "throwNewError") throw new Error(`Could not connect to database! Remote host: ${this.hostPort}`);
			process.exit(1);
		}
	}

	private async setDatabaseName() {
		const {
			rows: [{ current_database: currentDatabase }],
		} = await this.client.query<{ current_database: string }>(`
			SELECT current_database();
		`);
		this.dbName = currentDatabase;
		this.LOGGER = LOGGER?.extend("Fetcher").extend(currentDatabase);
		this.LOGGER?.("Connected to database: %s", currentDatabase);
	}

	private get formatted_connection_string(): string {
		if (typeof this.connection === "string") return this.connection;

		return this.connection.password
			? `postgres://${this.connection.user}:${this.connection.password}@${this.connection.host}:${this.connection.port}/${this.connection.database}`
			: `postgres://${this.connection.user}@${this.connection.host}:${this.connection.port}/${this.connection.database}`;
	}

	private get hostPort(): string {
		return this.formatted_connection_string.split("@")[1].split("/")[0];
	}

	private get schema_names(): string[] {
		return [...new Set(this.tables.map(({ schema_name: schemaName }) => schemaName))];
	}

	async fetchTables(): Promise<void> {
		this.LOGGER?.("Fetching tables...");
		const tables = await getTables(this.client, this.config, this.dbName);
		this.LOGGER?.("Fetched %d tables", tables.length);
		if (tables.length === 0) {
			this.progressBar.stop();
			if (this.generatorConfig?.silent !== true)
				console.log(getConsoleHeader(r("Could not fetch any tables!"), "Please check your schemas/tables settings.", false, `Remote host: ${this.hostPort}`));

			if (this.generatorConfig?.onError === "throwNewError") throw new Error(`Could not fetch any tables! Remote host: ${this.hostPort}`);
			process.exit(1);
		}
		this.tables = tables;
		this.progressBar.incrementProgress();
	}

	async fetchDataTypes(): Promise<void> {
		this.LOGGER?.("Fetching data types...");
		const types = await getDataTypes(this.client, this.schema_names);
		this.LOGGER?.("Fetched %d data types", types.length);
		if (types.length === 0) {
			this.progressBar.stop();
			if (this.generatorConfig?.silent !== true) {
				console.log(
					getConsoleHeader(r("Could not fetch any data types!"), "Please check your schemas/tables settings.", false, `Remote host: ${this.hostPort}`)
				);
			}

			if (this.generatorConfig?.onError === "throwNewError") throw new Error(`Could not fetch any data types! Remote host: ${this.hostPort}`);
			process.exit(1);
		}
		this.dataTypes = types;
		this.progressBar.incrementProgress();
	}

	async fetchClasses(): Promise<void> {
		this.LOGGER?.("Fetching classes...");
		const classes = await getClasses(this.client, {
			schema_names: this.schema_names,
			kind: [ClassKind.OrdinaryTable, ClassKind.View, ClassKind.MaterializedView],
		});
		this.LOGGER?.("Fetched %d classes", classes.length);
		if (classes.length === 0) {
			this.progressBar.stop();
			if (this.generatorConfig?.silent !== true)
				console.log(getConsoleHeader(r("Could not fetch any classes!"), "Please check your schemas/tables settings.", false, `Remote host: ${this.hostPort}`));

			if (this.generatorConfig?.onError === "throwNewError") throw new Error(`Could not fetch any classes! Remote host: ${this.hostPort}`);
			process.exit(1);
		}
		this.classes = classes;
		this.progressBar.incrementProgress();
	}

	async fetchAttributes(): Promise<void> {
		this.LOGGER?.("Fetching attributes...");
		const attributes = await getAttributes(this.client, {
			schema_names: this.schema_names,
			database_name: this.dbName,
		});
		this.LOGGER?.("Fetched %d attributes", attributes.length);
		if (attributes.length === 0) {
			this.progressBar.stop();
			if (this.generatorConfig?.silent !== true) {
				console.log(
					getConsoleHeader(r("Could not fetch any attributes!"), "Please check your schemas/tables settings.", false, `Remote host: ${this.hostPort}`)
				);
			}

			if (this.generatorConfig?.onError === "throwNewError") throw new Error(`Could not fetch any attributes! Remote host: ${this.hostPort}`);
			process.exit(1);
		}
		this.attributes = attributes;
		this.progressBar.incrementProgress();
	}

	async fetchConstraints(): Promise<void> {
		this.LOGGER?.("Fetching constraints...");
		const constraints = await getConstraints(this.client, this.schema_names);
		this.LOGGER?.("Fetched %d constraints", constraints.length);
		this.constraints = constraints;
		this.progressBar.incrementProgress();
	}

	public get fetchedData(): FetchedData {
		return {
			database: this.dbName,
			hostPort: this.hostPort,
			tables: this.tables,
			types: this.dataTypes,
			classes: this.classes.map(
				(cls): ClassDetails => ({
					...cls,
					attributes: this.attributes.filter(att => att.class_id === cls.class_id),
					constraints: this.constraints.filter(con => con.class_id === cls.class_id),
				})
			),
		};
	}

	public async disconnect(): Promise<void> {
		this.LOGGER?.("Disconnecting from database...");
		await this.client.end();
		this.LOGGER?.("Disconnected from database");
	}
}
