import { Client } from "pg";

(async () => {
	const client = new Client({
		password: "password",
		host: "localhost",
		user: "postgres",
		database: "postgres",
		port: 5432,
	});

	await client.connect();

	const tables = ["JestDataTypes", "JestOperators", "JestSelectAll", "JestSelectInputted"];

	for (const table of tables) await createTable(client, table);

	await client.end();
})();

async function createTable(client: Client, name: string) {
	await client.query(`
		CREATE TABLE public.${name} (
			id uuid NULL,
			bigint bigint NULL,
			bigserial bigserial,
			bit bit(3) NULL,
			bitvarying bit varying(3) NULL,
			bool bool NULL,
			boolean boolean NULL,
			box box NULL,
			bpchar bpchar NULL,
			bytea bytea NULL,
			cardinalnumber information_schema."cardinal_number" NULL,
			char char NULL,
			charvarying char varying(3) NULL,
			character character NULL,
			charactervarying character varying(3) NULL,
			characterdata information_schema."character_data" NULL,
			cid cid NULL,
			cidr cidr NULL,
			circle circle NULL,
			date date NULL,
			datemultirange datemultirange NULL,
			daterange daterange NULL,
			decimal decimal NULL,
			float4 float4 NULL,
			float8 float8 NULL,
			inet inet NULL,
			int int NULL,
			int2 int2 NULL,
			int4 int4 NULL,
			int4multirange int4multirange NULL,
			int4range int4range NULL,
			int8 int8 NULL,
			int8multirange int8multirange NULL,
			int8range int8range NULL,
			integer integer NULL,
			interval interval NULL,
			jsonb jsonb NULL,
			money money NULL,
			name name NULL,
			numeric numeric NULL,
			smallint smallint NULL,
			text text NULL,
			time time NULL,
			timewithtimezone time with time zone NULL,
			timewithouttimezone time without time zone NULL,
			timestamp timestamp NULL,
			timestampwithtimezone timestamp with time zone NULL,
			timestampwithouttimezone timestamp without time zone NULL,
			timestamptz timestamptz NULL,
			timetz timetz NULL,
			uuid uuid NULL,
			varchar varchar NULL,
			_id _uuid NULL,
			_bit _bit(3) NULL,
			_bool _bool NULL,
			_box _box NULL,
			_bpchar _bpchar NULL,
			_bytea _bytea NULL,
			_char _char NULL,
			_cid _cid NULL,
			_cidr _cidr NULL,
			_circle _circle NULL,
			_date _date NULL,
			_datemultirange _datemultirange NULL,
			_daterange _daterange NULL,
			_float4 _float4 NULL,
			_float8 _float8 NULL,
			_inet _inet NULL,
			_int2 _int2 NULL,
			_int4 _int4 NULL,
			_int4multirange _int4multirange NULL,
			_int4range _int4range NULL,
			_int8 _int8 NULL,
			_int8multirange _int8multirange NULL,
			_int8range _int8range NULL,
			_interval _interval NULL,
			_jsonb _jsonb NULL,
			_money _money NULL,
			_name _name NULL,
			_numeric _numeric NULL,
			_text _text NULL,
			_time _time NULL,
			_timestamp _timestamp NULL,
			_timestamptz _timestamptz NULL,
			_timetz _timetz NULL,
			_uuid _uuid NULL,
			_varchar _varchar NULL,
			CONSTRAINT ${name}_pk PRIMARY KEY (id)
		)
	`);
}
