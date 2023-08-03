export type TypeId =
	| { type: "domain"; name: string }
	| { type: "enum"; name: string; databaseName: string }
	| { type: "enumType"; name: string; databaseName: string }
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
	| { type: "databaseReexport"; name: string }
	| { type: "databaseTypeReexport"; name: string }
	| { type: "schema"; name: string; databaseName: string }
	| { type: "schemaType"; name: string; databaseName: string }
	| { type: "schemaReexport"; name: string; databaseName: string }
	| { type: "schemaTypeReexport"; name: string; databaseName: string }
	| {
			type: "table";
			name: string;
			databaseName: string;
			schemaName: string;
	  }
	| {
			type: "tableType";
			name: string;
			databaseName: string;
			schemaName: string;
	  }
	| {
			type: "tableInferType";
			name: string;
			databaseName: string;
			schemaName: string;
	  }
	| {
			type: "tableInsertInferType";
			name: string;
			databaseName: string;
			schemaName: string;
	  }
	| {
			type: "column";
			name: string;
			databaseName: string;
			schemaName: string;
			tableName: string;
	  }
	| {
			type: "export";
			of:
				| { type: "databaseReexport"; name: string }
				| { type: "databaseTypeReexport"; name: string }
				| { type: "schema"; name: string; databaseName: string }
				| { type: "schemaType"; name: string; databaseName: string }
				| { type: "schemaReexport"; name: string; databaseName: string }
				| { type: "schemaTypeReexport"; name: string; databaseName: string }
				| {
						type: "table";
						name: string;
						databaseName: string;
						schemaName: string;
				  }
				| {
						type: "tableType";
						name: string;
						databaseName: string;
						schemaName: string;
				  }
				| {
						type: "tableInferType";
						name: string;
						databaseName: string;
						schemaName: string;
				  }
				| {
						type: "tableInsertInferType";
						name: string;
						databaseName: string;
						schemaName: string;
				  };
	  };
