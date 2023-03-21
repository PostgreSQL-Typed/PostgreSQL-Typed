export type TypeId =
	| {
			type: "table_type";
			name: string;
			databaseName: string;
			schemaName: string;
	  }
	| {
			type: "table_data";
			name: string;
			databaseName: string;
			schemaName: string;
	  }
	| {
			type: "insert_parameters_type";
			name: string;
			databaseName: string;
			schemaName: string;
	  }
	| {
			type: "insert_parameters_data";
			name: string;
			databaseName: string;
			schemaName: string;
	  }
	| {
			type: "primary_key";
			name: string;
			databaseName: string;
			schemaName: string;
	  }
	| { type: "schema_type"; name: string; databaseName: string }
	| { type: "schema_data"; name: string; databaseName: string }
	| { type: "database_type"; name: string }
	| { type: "database_data"; name: string }
	| { type: "full_export_type" }
	| { type: "full_export_data" }
	| { type: "domain_type"; name: string }
	| { type: "domain_data"; name: string }
	| { type: "enum"; name: string; databaseName: string }
	| {
			type: "debug";
			date: string;
			time: string;
			timestamp: string;
			year: string;
			month: string;
			day: string;
			hour: string;
			minute: string;
			second: string;
			millisecond: string;
	  }
	| {
			type: "re_export";
			of:
				| {
						type: "table_type";
						name: string;
						databaseName: string;
						schemaName: string;
				  }
				| {
						type: "table_data";
						name: string;
						databaseName: string;
						schemaName: string;
				  }
				| {
						type: "insert_parameters_type";
						name: string;
						databaseName: string;
						schemaName: string;
				  }
				| {
						type: "insert_parameters_data";
						name: string;
						databaseName: string;
						schemaName: string;
				  }
				| {
						type: "primary_key";
						name: string;
						databaseName: string;
						schemaName: string;
				  }
				| { type: "schema_type"; name: string; databaseName: string }
				| { type: "schema_data"; name: string; databaseName: string }
				| { type: "database_type"; name: string }
				| { type: "database_data"; name: string }
				| { type: "full_export_type" }
				| { type: "full_export_data" };
	  };
