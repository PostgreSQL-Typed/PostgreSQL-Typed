export type Query<Data> = {
	rows: Data[];
	rowCount: number;
	command: string;
};
