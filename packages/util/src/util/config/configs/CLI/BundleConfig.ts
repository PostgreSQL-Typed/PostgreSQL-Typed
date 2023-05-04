export interface BundleConfig {
	/**
	 * Whether to bundle the generated code into a single file
	 *
	 * @default false
	 */
	enabled: boolean;

	/**
	 * What should the bundle file be called
	 *
	 * You may use the following placeholders:
	 * - `DATE`: The current date (YYYY-MM-DD)
	 * - `TIME`: The current time (HH:MM:SS.sss)
	 * - `TIMESTAMP`: The current timestamp (YYYY-MM-DD_HH:MM:SS.sss)
	 * - `YEAR`: The current year (YYYY)
	 * - `MONTH`: The current month (MM)
	 * - `DAY`: The current day (DD)
	 * - `HOUR`: The current hour (HH)
	 * - `MINUTE`: The current minute (MM)
	 * - `SECOND`: The current second (SS)
	 * - `MILLISECOND`: The current millisecond (sss)
	 *
	 * Note: The timestamp is in UTC time
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "index.ts"
	 */
	bundleFileName: string;

	/**
	 * What should custom types be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TYPE_NAME`: The name of the type
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ TYPE_NAME | default }}"
	 */
	domainTypeName: string;

	/**
	 * What should domain data be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TYPE_NAME`: The name of the type
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ TYPE_NAME | default }}Data"
	 */
	domainDataTypeName: string;

	/**
	 * What should enum types be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TYPE_NAME`: The name of the type
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ DATABASE_NAME | default }}{{ TYPE_NAME | default }}"
	 */
	enumTypeName: string;

	/**
	 * What should primary key types be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TABLE_NAME`: The name of the table
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}PrimaryKey"
	 */
	primaryKeyTypeName: string;

	/**
	 * What should table types be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TABLE_NAME`: The name of the table
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}"
	 */
	tableTypeName: string;

	/**
	 * What should table data be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TABLE_NAME`: The name of the table
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}Data"
	 */
	tableDataTypeName: string;

	/**
	 * What should table insert parameter types be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TABLE_NAME`: The name of the table
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}InsertParameters"
	 */
	tableInsertParametersTypeName: string;

	/**
	 * What should table insert parameter data be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TABLE_NAME`: The name of the table
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}InsertParametersData"
	 */
	tableInsertParametersDataTypeName: string;

	/**
	 * What should schema types be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}"
	 */
	schemaTypeName: string;

	/**
	 * What should schema data be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ SCHEMA_NAME | default }}Data"
	 */
	schemaDataTypeName: string;

	/**
	 * What should database types be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ DATABASE_NAME | default }}"
	 */
	databaseTypeName: string;

	/**
	 * What should database data be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ DATABASE_NAME | default }}Data"
	 */
	databaseDataTypeName: string;

	/**
	 * What should the full export of the databases types be called in the generated code
	 *
	 * @default "Databases"
	 */
	fullExportTypeName: string;

	/**
	 * What should the full export of the databases data be called in the generated code
	 *
	 * @default "DatabasesData"
	 */
	fullExportDataTypeName: string;
}

export function setDefaultBundleConfig(config: Record<string, any>): BundleConfig {
	if (config.enabled && typeof config.enabled !== "boolean") delete config.enabled;
	if (config.bundleFileName && typeof config.bundleFileName !== "string") delete config.bundleFileName;
	if (config.domainTypeName && typeof config.domainTypeName !== "string") delete config.domainTypeName;
	if (config.domainDataTypeName && typeof config.domainDataTypeName !== "string") delete config.domainDataTypeName;
	if (config.enumTypeName && typeof config.enumTypeName !== "string") delete config.enumTypeName;
	if (config.primaryKeyTypeName && typeof config.primaryKeyTypeName !== "string") delete config.primaryKeyTypeName;
	if (config.tableTypeName && typeof config.tableTypeName !== "string") delete config.tableTypeName;
	if (config.tableDataTypeName && typeof config.tableDataTypeName !== "string") delete config.tableDataTypeName;
	if (config.tableInsertParametersTypeName && typeof config.tableInsertParametersTypeName !== "string") delete config.tableInsertParametersTypeName;
	if (config.tableInsertParametersDataTypeName && typeof config.tableInsertParametersDataTypeName !== "string") delete config.tableInsertParametersDataTypeName;
	if (config.schemaTypeName && typeof config.schemaTypeName !== "string") delete config.schemaTypeName;
	if (config.schemaDataTypeName && typeof config.schemaDataTypeName !== "string") delete config.schemaDataTypeName;
	if (config.databaseTypeName && typeof config.databaseTypeName !== "string") delete config.databaseTypeName;
	if (config.databaseDataTypeName && typeof config.databaseDataTypeName !== "string") delete config.databaseDataTypeName;
	if (config.fullExportTypeName && typeof config.fullExportTypeName !== "string") delete config.fullExportTypeName;
	if (config.fullExportDataTypeName && typeof config.fullExportDataTypeName !== "string") delete config.fullExportDataTypeName;

	return {
		enabled: config.enabled ?? false,
		bundleFileName: config.bundleFileName ?? "index.ts",
		domainTypeName: config.domainTypeName ?? "{{ TYPE_NAME | default }}",
		domainDataTypeName: config.domainDataTypeName ?? "{{ TYPE_NAME | default }}Data",
		enumTypeName: config.enumTypeName ?? "{{ TYPE_NAME | default }}",
		primaryKeyTypeName: config.primaryKeyTypeName ?? "{{ TABLE_NAME | default }}PrimaryKey",
		tableTypeName: config.tableTypeName ?? "{{ TABLE_NAME | default }}",
		tableDataTypeName: config.tableDataTypeName ?? "{{ TABLE_NAME | default }}Data",
		tableInsertParametersTypeName: config.tableInsertParametersTypeName ?? "{{ TABLE_NAME | default }}InsertParameters",
		tableInsertParametersDataTypeName: config.tableInsertParametersDataTypeName ?? "{{ TABLE_NAME | default }}InsertParametersData",
		schemaTypeName: config.schemaTypeName ?? "{{ SCHEMA_NAME | default }}",
		schemaDataTypeName: config.schemaDataTypeName ?? "{{ SCHEMA_NAME | default }}Data",
		databaseTypeName: config.databaseTypeName ?? "{{ DATABASE_NAME | default }}",
		databaseDataTypeName: config.databaseDataTypeName ?? "{{ DATABASE_NAME | default }}Data",
		fullExportTypeName: config.fullExportTypeName ?? "Databases",
		fullExportDataTypeName: config.fullExportDataTypeName ?? "DatabasesData",
	};
}
