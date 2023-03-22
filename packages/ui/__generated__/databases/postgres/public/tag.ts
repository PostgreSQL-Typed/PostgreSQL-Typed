/**
 * !!! THIS FILE IS AUTOMATICALLY GENERATED, PLEASE DO NOT EDIT THIS FILE MANUALLY !!!
 *
 * Generated by: @PostgreSQL-Typed/CLI
 * Checksum: mqLLcirXZCaVVCJ3haAn3kWSYEQcG05vIejUIDIXHXWK21cOFD5mrGtCA0qnwDuRZYY5p7HwgJzwea7+JGs5FQ==
 */

/* eslint-disable */
// tslint:disable
/* deepscan-disable */

import {Int4, Text, PGTPParser} from "@postgresql-typed/parsers";

interface Tag {
  /**
   * @kind PrimaryKey
   * 
   * @kind integer
   * 
   * @default nextval('tag_id_seq'::regclass)
   */
  id: Int4
  /**
   * @kind text
   */
  tag_value: Text | null
}
export type {Tag}

const Tag_Data = {
  /**
   * @kind PrimaryKey
   * 
   * @kind integer
   * 
   * @default nextval('tag_id_seq'::regclass)
   */
  id: PGTPParser(Int4),
  /**
   * @kind text
   */
  tag_value: PGTPParser(Text).nullable(),
};
export {Tag_Data}

interface Tag_InsertParameters {
  /**
   * @kind PrimaryKey
   * 
   * @kind integer
   * 
   * @default nextval('tag_id_seq'::regclass)
   */
  id?: Int4
  /**
   * @kind text
   */
  tag_value?: Text | null
}
export type {Tag_InsertParameters}

const Tag_InsertParameters_Data = {
  /**
   * @kind PrimaryKey
   * 
   * @kind integer
   * 
   * @default nextval('tag_id_seq'::regclass)
   */
  id: PGTPParser(Int4).optional(),
  /**
   * @kind text
   */
  tag_value: PGTPParser(Text).nullable().optional(),
};
export {Tag_InsertParameters_Data}

const Tag_PrimaryKey: "id" = "id"
export {Tag_PrimaryKey}
