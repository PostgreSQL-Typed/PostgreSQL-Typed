import type { Client } from "pg";
import type PostgreSQLCaching from "../../src";
export declare function insertData(PC: PostgreSQLCaching): Promise<void>;
export declare function insertExtraData(PC: PostgreSQLCaching): Promise<void>;
export declare function insertNullData(PC: PostgreSQLCaching): Promise<void>;
export declare function createTable(sql: Client, name: string): Promise<void>;
