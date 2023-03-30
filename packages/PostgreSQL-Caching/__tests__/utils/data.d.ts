/// <reference types="node" resolution-mode="require"/>
export declare const insertedData: {
    id: string;
    bigint: string;
    bigserial: string;
    bit: string;
    bitvarying: string;
    bool: boolean;
    boolean: boolean;
    box: string;
    bpchar: string;
    bytea: Buffer;
    cardinalnumber: number;
    char: string;
    charvarying: string;
    character: string;
    charactervarying: string;
    characterdata: string;
    cid: string;
    cidr: string;
    circle: {
        radius: number;
        x: number;
        y: number;
    };
    date: string;
    datemultirange: string;
    daterange: string;
    decimal: string;
    float4: number;
    float8: number;
    inet: string;
    int: number;
    int2: number;
    int4: number;
    int4multirange: string;
    int4range: string;
    int8: string;
    int8multirange: string;
    int8range: string;
    integer: number;
    interval: {
        hours: number;
        milliseconds: number;
        minutes: number;
        seconds: number;
    };
    jsonb: {
        items: {
            qty: number;
            product: string;
        };
        customer: string;
    };
    money: string;
    name: string;
    numeric: string;
    smallint: number;
    text: string;
    time: string;
    timewithtimezone: string;
    timewithouttimezone: string;
    timestamp: string;
    timestampwithtimezone: string;
    timestampwithouttimezone: string;
    timestamptz: string;
    timetz: string;
    uuid: string;
    varchar: string;
};
export declare const extraData: {
    id: string;
    bigint: string;
    bigserial: string;
    bit: string;
    bitvarying: string;
    bool: boolean;
    boolean: boolean;
    box: string;
    bpchar: string;
    bytea: Buffer;
    cardinalnumber: number;
    char: string;
    charvarying: string;
    character: string;
    charactervarying: string;
    characterdata: string;
    cid: string;
    cidr: string;
    circle: {
        radius: number;
        x: number;
        y: number;
    };
    date: string;
    datemultirange: string;
    daterange: string;
    decimal: string;
    float4: number;
    float8: number;
    inet: string;
    int: number;
    int2: number;
    int4: number;
    int4multirange: string;
    int4range: string;
    int8: string;
    int8multirange: string;
    int8range: string;
    integer: number;
    interval: {
        days: number;
        seconds: number;
    };
    jsonb: {
        items: {
            qty: number;
            product: string;
        };
        customer: string;
    };
    money: string;
    name: string;
    numeric: string;
    smallint: number;
    text: string;
    time: string;
    timewithtimezone: string;
    timewithouttimezone: string;
    timestamp: string;
    timestampwithtimezone: string;
    timestampwithouttimezone: string;
    timestamptz: string;
    timetz: string;
    uuid: string;
    varchar: string;
};
export declare const nullData: {
    id: string;
    bigint: null;
    bigserial: string;
    bit: null;
    bitvarying: null;
    bool: null;
    boolean: null;
    box: null;
    bpchar: null;
    bytea: null;
    cardinalnumber: null;
    char: null;
    charvarying: null;
    character: null;
    charactervarying: null;
    characterdata: null;
    cid: null;
    cidr: null;
    circle: null;
    date: null;
    datemultirange: null;
    daterange: null;
    decimal: null;
    float4: null;
    float8: null;
    inet: null;
    int: null;
    int2: null;
    int4: null;
    int4multirange: null;
    int4range: null;
    int8: null;
    int8multirange: null;
    int8range: null;
    integer: null;
    interval: null;
    jsonb: null;
    money: null;
    name: null;
    numeric: null;
    smallint: null;
    text: null;
    time: null;
    timewithtimezone: null;
    timewithouttimezone: null;
    timestamp: null;
    timestampwithtimezone: null;
    timestampwithouttimezone: null;
    timestamptz: null;
    timetz: null;
    uuid: null;
    varchar: null;
};
export type TestData = typeof insertedData;
