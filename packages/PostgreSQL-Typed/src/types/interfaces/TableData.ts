/* eslint-disable @typescript-eslint/ban-types */
export interface TableData {
	name: string;
	primary_key?: string;
	columns: Object;
	insert_parameters: Object;
}
