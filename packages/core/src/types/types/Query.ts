export type Query<Data> = {
	rows: Data[];
	rowCount: number;
	command: string;
	input: {
		query: string;
		values: (string | number | boolean)[];
	};
};
