export async function insertData(PC) {
    await PC.sql.query(`
		INSERT INTO ${PC.schema}.${PC.table} (
			id,
			bigint,
			bigserial,
			bit,
			bitvarying,
			bool,
			boolean,
			box,
			bpchar,
			bytea,
			cardinalnumber,
			char,
			charvarying,
			character,
			charactervarying,
			characterdata,
			cid,
			cidr,
			circle,
			date,
			datemultirange,
			daterange,
			decimal,
			float4,
			float8,
			inet,
			int,
			int2,
			int4,
			int4multirange,
			int4range,
			int8,
			int8multirange,
			int8range,
			integer,
			interval,
			jsonb,
			money,
			name,
			numeric,
			smallint,
			text,
			time,
			timewithtimezone,
			timewithouttimezone,
			timestamp,
			timestampwithtimezone,
			timestampwithouttimezone,
			timestamptz,
			timetz,
			uuid,
			varchar
		)
    VALUES (
      '4e5797e0-ef31-4b15-b85f-957b25cc81ac',
			${BigInt(9007199254740991)},
			'9223372036854775807',
			'101',
			'10',
			true,
			false,
			'(1,1),(1,1)',
			'Text',
			'${Buffer.from("abc \u00DEADBEEF").toString()}',
			1,
			'A',
			'D',
			'B',
			'C',
			'E',
			'123',
			'192.168.100.128/25',
			'<(1,1),1>',
			'1997-08-24T00:00:00.000Z',
			'{[2021-05-01, 2021-06-01), [2020-09-01, 2020-10-01), [2021-09-01, 2021-09-13)}',
			'[2020-09-01, 2020-10-01)',
			9999,
			8888,
			7777,
			'192.168.100.128',
			6666,
			5555,
			4444,
			'{[1,3),[8,11),[5,7)}',
			'[1,3)',
			3333,
			'{[101,103),[108,111),[105,107)}',
			'[101,103)',
			2222,
			'01:02:03.456',
			'{"items":{"qty":6,"product":"Beer"},"customer":"John Doe"}',
			1111,
			'Jest',
			1,
			2,
			'Text',
			'11:11:11',
			'11:11:11+1111',
			'11:11:11',
			'1999-01-08 04:05:06',
			'1999-01-08 04:05:06+02',
			'1999-01-08 04:05:06',
			'1999-01-08 04:05:06+02',
			'11:11:11+1111',
			'd006750c-e3ec-49b2-9f7e-ab81e10b4993',
			'Hello'
		);
  `);
}
export async function insertExtraData(PC) {
    await PC.sql.query(`
		INSERT INTO ${PC.schema}.${PC.table} (
			id,
			bigint,
			bigserial,
			bit,
			bitvarying,
			bool,
			boolean,
			box,
			bpchar,
			bytea,
			cardinalnumber,
			char,
			charvarying,
			character,
			charactervarying,
			characterdata,
			cid,
			cidr,
			circle,
			date,
			datemultirange,
			daterange,
			decimal,
			float4,
			float8,
			inet,
			int,
			int2,
			int4,
			int4multirange,
			int4range,
			int8,
			int8multirange,
			int8range,
			integer,
			interval,
			jsonb,
			money,
			name,
			numeric,
			smallint,
			text,
			time,
			timewithtimezone,
			timewithouttimezone,
			timestamp,
			timestampwithtimezone,
			timestampwithouttimezone,
			timestamptz,
			timetz,
			uuid,
			varchar
		)
		VALUES (
			'5e5797e0-ef31-4b15-b85f-957b25cc81ac',
			${BigInt(9007199254740991)},
			'9123372036854775807',
			'111',
			'11',
			false,
			true,
			'(2,2),(2,2)',
			'Text2',
			'${Buffer.from("efg \u00DEADBEEF").toString()}',
			2,
			'B',
			'C',
			'A',
			'D',
			'F',
			'456',
			'2001:4f8:3:ba:2e0:81ff:fe22:d1f1/128',
			'<(2,2),2>',
			'1997-08-24T00:00:00.000Z',
			'{[2021-05-01, 2021-06-01), [2021-09-02, 2021-09-15), [2021-09-01, 2021-09-13)}',
			'[2021-09-02, 2021-09-15)',
			8888,
			9999,
			6666,
			'2001:4f8:3:ba:2e0:81ff:fe22:d1f1',
			7777,
			4444,
			5555,
			'{[11,13),[18,21),[15,17)}',
			'[11,13)',
			2222,
			'{[111,113),[118,121),[115,117)}',
			'[111,113)',
			3333,
			'1 day -00:00:03',
			'{"items":{"qty":9,"product":"Milk"},"customer":"John Dere"}',
			2222,
			'Jest2',
			2,
			1,
			'Text2',
			'10:10:10',
			'10:10:10+1010',
			'10:10:10',
			'1999-01-08 04:05:06',
			'1999-01-08 04:05:06+02',
			'1999-01-08 04:05:06',
			'1999-01-08 04:05:06+02',
			'10:10:10+1010',
			'39ce5daf-293d-4e5f-982a-4eee42597f44',
			'Hello world'
		);
  `);
}
export async function insertNullData(PC) {
    await PC.sql.query(`
		INSERT INTO ${PC.schema}.${PC.table} (
			id,
			bigint,
			bigserial,
			bit,
			bitvarying,
			bool,
			boolean,
			box,
			bpchar,
			bytea,
			cardinalnumber,
			char,
			charvarying,
			character,
			charactervarying,
			characterdata,
			cid,
			cidr,
			circle,
			date,
			datemultirange,
			daterange,
			decimal,
			float4,
			float8,
			inet,
			int,
			int2,
			int4,
			int4multirange,
			int4range,
			int8,
			int8multirange,
			int8range,
			integer,
			interval,
			jsonb,
			money,
			name,
			numeric,
			smallint,
			text,
			time,
			timewithtimezone,
			timewithouttimezone,
			timestamp,
			timestampwithtimezone,
			timestampwithouttimezone,
			timestamptz,
			timetz,
			uuid,
			varchar
		)
		VALUES (
			'73a55521-3ab7-442a-bf0f-e6992e2cbec8',
			NULL,
			'9223372036854775807',
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL,
			NULL
		);
	`);
}
export async function createTable(sql, name) {
    await sql.query(`
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
			CONSTRAINT ${name}_pk PRIMARY KEY (id)
		)
	`);
}
//# sourceMappingURL=functions.js.map