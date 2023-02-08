import { Client } from "pg";

const client = new Client({
	password: "password",
	host: "localhost",
	user: "postgres",
	database: "postgres",
	port: 5432,
});

await client.connect();

const tables = ["JestDataTypes", "JestOperators", "JestSelectAll", "JestSelectInputted"];

for (const table of tables) await client.query(`DROP TABLE public.${table}`);

await client.end();
