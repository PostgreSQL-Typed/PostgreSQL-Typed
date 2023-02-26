export type TypeId =
	| {
			type: "table";
			name: string;
			databaseName: string;
			schemaName: string;
	  }
	| {
			type: "insert_parameters";
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
	| { type: "domain"; name: string }
	| { type: "enum"; name: string; databaseName: string }
	| {
			type: "z_insert_parameters";
			name: string;
			databaseName: string;
			schemaName: string;
	  }
	| { type: "z_schema_data"; name: string; databaseName: string }
	| { type: "z_database_data"; name: string }
	| { type: "z_domain"; name: string }
	| { type: "z_enum"; name: string; databaseName: string }
	| {
			type: "re_export";
			of:
				| {
						type: "table";
						name: string;
						databaseName: string;
						schemaName: string;
				  }
				| {
						type: "insert_parameters";
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
				| {
						type: "z_insert_parameters";
						name: string;
						databaseName: string;
						schemaName: string;
				  }
				| { type: "z_schema_data"; name: string; databaseName: string }
				| { type: "z_database_data"; name: string };
	  };
