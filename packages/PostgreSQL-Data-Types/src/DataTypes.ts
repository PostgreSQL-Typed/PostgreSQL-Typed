export enum DataType {
	//* Array

	/**
	 * `Array<abstime>`
	 */
	_abstime = 1023,

	/**
	 * `Array<aclitem>`
	 */
	_aclitem = 1034,

	/**
	 * `Array<bit>`
	 */
	_bit = 1561,

	/**
	 * `Array<bool>`
	 */
	_bool = 1000,

	/**
	 * `Array<box>`
	 */
	_box = 1020,

	/**
	 * `Array<bpchar>`
	 */
	_bpchar = 1014,

	/**
	 * `Array<bytea>`
	 */
	_bytea = 1001,

	/**
	 * `Array<char>`
	 */
	_char = 1002,

	/**
	 * `Array<cid>`
	 */
	_cid = 1012,

	/**
	 * `Array<cidr>`
	 */
	_cidr = 651,

	/**
	 * `Array<circle>`
	 */
	_circle = 719,

	/**
	 * `Array<cstring>`
	 */
	_cstring = 1263,

	/**
	 * `Array<date>`
	 */
	_date = 1182,

	/**
	 * `Array<datemultirange>`
	 */
	_datemultirange = 6155,

	/**
	 * `Array<daterange>`
	 */
	_daterange = 3913,

	/**
	 * `Array<float4>`
	 */
	_float4 = 1021,

	/**
	 * `Array<float8>`
	 */
	_float8 = 1022,

	/**
	 * `Array<gtsvector>`
	 */
	_gtsvector = 3644,

	/**
	 * `Array<inet>`
	 */
	_inet = 1041,

	/**
	 * `Array<int2>`
	 */
	_int2 = 1005,

	/**
	 * `Array<int2vector>`
	 */
	_int2vector = 1006,

	/**
	 * `Array<int4>`
	 */
	_int4 = 1007,

	/**
	 * `Array<int4multirange>`
	 */
	_int4multirange = 6150,

	/**
	 * `Array<int4range>`
	 */
	_int4range = 3905,

	/**
	 * `Array<int8>`
	 */
	_int8 = 1016,

	/**
	 * `Array<int8multirange>`
	 */
	_int8multirange = 6157,

	/**
	 * `Array<int8range>`
	 */
	_int8range = 3927,

	/**
	 * `Array<interval>`
	 */
	_interval = 1187,

	/**
	 * `Array<json>`
	 */
	_json = 199,

	/**
	 * `Array<jsonb>`
	 */
	_jsonb = 3807,

	/**
	 * `Array<jsonpath>`
	 */
	_jsonpath = 4073,

	/**
	 * `Array<line>`
	 */
	_line = 629,

	/**
	 * `Array<lseg>`
	 */
	_lseg = 1018,

	/**
	 * `Array<macaddr>`
	 */
	_macaddr = 1040,

	/**
	 * `Array<macaddr8>`
	 */
	_macaddr8 = 775,

	/**
	 * `Array<money>`
	 */
	_money = 791,

	/**
	 * `Array<name>`
	 */
	_name = 1003,

	/**
	 * `Array<numeric>`
	 */
	_numeric = 1231,

	/**
	 * `Array<numrange>`
	 */
	_numrange = 3907,

	/**
	 * `Array<oid>`
	 */
	_oid = 1028,

	/**
	 * `Array<oidvector>`
	 */
	_oidvector = 1013,

	/**
	 * `Array<path>`
	 */
	_path = 1019,

	/**
	 * `Array<pg_lsn>`
	 */
	_pg_lsn = 3221,

	/**
	 * `Array<pg_snapshot>`
	 */
	_pg_snapshot = 5039,

	/**
	 * `Array<point>`
	 */
	_point = 1017,

	/**
	 * `Array<polygon>`
	 */
	_polygon = 1027,

	/**
	 * `Array<refcursor>`
	 */
	_refcursor = 2201,

	/**
	 * `Array<regclass>`
	 */
	_regclass = 2210,

	/**
	 * `Array<regcollation>`
	 */
	_regcollation = 4192,

	/**
	 * `Array<regconfig>`
	 */
	_regconfig = 3735,

	/**
	 * `Array<regdictionary>`
	 */
	_regdictionary = 3770,

	/**
	 * `Array<regnamespace>`
	 */
	_regnamespace = 4090,

	/**
	 * `Array<regoper>`
	 */
	_regoper = 2208,

	/**
	 * `Array<regoperator>`
	 */
	_regoperator = 2209,

	/**
	 * `Array<regproc>`
	 */
	_regproc = 1008,

	/**
	 * `Array<regprocedure>`
	 */
	_regprocedure = 2207,

	/**
	 * `Array<regrole>`
	 */
	_regrole = 4097,

	/**
	 * `Array<regtype>`
	 */
	_regtype = 2211,

	/**
	 * `Array<reltime>`
	 */
	_reltime = 1024,

	/**
	 * `Array<text>`
	 */
	_text = 1009,

	/**
	 * `Array<tid>`
	 */
	_tid = 1010,

	/**
	 * `Array<time>`
	 */
	_time = 1183,

	/**
	 * `Array<timestamp>`
	 */
	_timestamp = 1115,

	/**
	 * `Array<timestamptz>`
	 */
	_timestamptz = 1185,

	/**
	 * `Array<timetz>`
	 */
	_timetz = 1270,

	/**
	 * `Array<tinterval>`
	 */
	_tinterval = 1025,

	/**
	 * `Array<tsquery>`
	 */
	_tsquery = 3645,

	/**
	 * `Array<tsrange>`
	 */
	_tsrange = 3909,

	/**
	 * `Array<tstzrange>`
	 */
	_tstzrange = 3911,

	/**
	 * `Array<tsvector>`
	 */
	_tsvector = 3643,

	/**
	 * `Array<txid_snapshot>`
	 */
	_txid_snapshot = 2949,

	/**
	 * `Array<uuid>`
	 */
	_uuid = 2951,

	/**
	 * `Array<varbit>`
	 */
	_varbit = 1563,

	/**
	 * `Array<varchar>`
	 */
	_varchar = 1015,

	/**
	 * `Array<xid>`
	 */
	_xid = 1011,

	/**
	 * `Array<xid8>`
	 */
	_xid8 = 271,

	/**
	 * `Array<xml>`
	 */
	_xml = 143,

	/**
	 * Array of int2, used in system tables
	 *
	 * `Array<int2>`
	 */
	int2vector = 22,

	/**
	 * Array of oid's, used in system tables
	 *
	 * `Array<oid>`
	 */
	oidvector = 30,

	//* PseudoTypes

	_record = 2287,

	/**
	 * Pseudo-type representing any type
	 */
	any = 2276,

	/**
	 * Pseudo-type representing a polymorphic array type
	 */
	anyarray = 2277,

	/**
	 * Pseudo-type representing a polymorphic common type
	 */
	anycompatible = 5077,

	/**
	 * Pseudo-type representing a multirange over a polymorphic common type
	 */
	anymultirange = 4537,

	/**
	 * Pseudo-type representing a multirange over a polymorphic common type
	 */
	anycompatiblemultirange = 4538,

	/**
	 * Pseudo-type representing an array of polymorphic common type elements
	 */
	anycompatiblearray = 5078,

	/**
	 * Pseudo-type representing a polymorphic common type that is not an array
	 */
	anycompatiblenonarray = 5079,

	/**
	 * Pseudo-type representing a range over a polymorphic common type
	 */
	anycompatiblerange = 5080,

	/**
	 * Pseudo-type representing a polymorphic base type
	 */
	anyelement = 2283,

	/**
	 * Pseudo-type representing a polymorphic base type that is an enum
	 */
	anyenum = 3500,

	/**
	 * Pseudo-type representing a polymorphic base type that is not an array
	 */
	anynonarray = 2776,

	/**
	 * Pseudo-type representing a range over a polymorphic base type
	 */
	anyrange = 3831,

	/**
	 * C-style string
	 */
	cstring = 2275,

	/**
	 * Pseudo-type for the result of an event trigger function
	 */
	event_trigger = 3838,

	/**
	 * Pseudo-type for the result of an FDW handler function
	 */
	fdw_handler = 3115,

	/**
	 * Pseudo-type for the result of an index AM handler function
	 */
	index_am_handler = 325,

	/**
	 * Pseudo-type representing an internal data structure
	 */
	internal = 2281,

	/**
	 * Pseudo-type for the result of a language handler function
	 */
	language_handler = 2280,

	/**
	 * Obsolete, deprecated Pseudo-type
	 */
	opaque = 2282,

	/**
	 * Internal type for passing CollectedCommand
	 */
	pg_ddl_command = 32,

	/**
	 * Pseudo-type representing any composite type
	 */
	record = 2249,

	table_am_handler = 269,

	/**
	 * Pseudo-type for the result of a trigger function
	 */
	trigger = 2279,

	/**
	 * Pseudo-type for the result of a tablesample method function
	 */
	tsm_handler = 3310,

	/**
	 * Pseudo-type for the result of a function with no real result
	 */
	void = 2278,

	//* DateTime

	/**
	 * Absolute, limited-range date and time (Unix system time)
	 */
	abstime = 702,

	/**
	 * Date
	 */
	date = 1082,

	/**
	 * Time of day
	 */
	time = 1083,

	/**
	 * Date and time
	 */
	timestamp = 1114,

	/**
	 * Date and time with time zone
	 */
	timestamptz = 1184,

	/**
	 * Time of day with time zone
	 */
	timetz = 1266,

	//* UserDefined

	/**
	 * Access control list
	 */
	aclitem = 1033,

	/**
	 * Variable-length string, binary values escaped
	 */
	bytea = 17,

	/**
	 * Command identifier type, sequence in transaction id
	 */
	cid = 29,

	/**
	 * GiST index internal text representation for text search
	 */
	gtsvector = 3642,

	/**
	 * JSON stored as text
	 */
	json = 114,

	/**
	 * Binary JSON
	 */
	jsonb = 3802,

	/**
	 * JSON path
	 */
	jsonpath = 4072,

	/**
	 * XX:XX:XX:XX:XX:XX, MAC address
	 */
	macaddr = 829,

	/**
	 * XX:XX:XX:XX:XX:XX:XX:XX, MAC address
	 */
	macaddr8 = 774,

	/**
	 * PostgreSQL LSN datatype
	 */
	pg_lsn = 3220,

	/**
	 * Snapshot
	 */
	pg_snapshot = 5038,

	/**
	 * Reference to cursor (portal name)
	 */
	refcursor = 1790,

	/**
	 * Storage manager
	 */
	smgr = 210,

	/**
	 * (block, offset), physical location of tuple
	 */
	tid = 27,

	/**
	 * Query representation for text search
	 */
	tsquery = 3615,

	/**
	 * Text representation for text search
	 */
	tsvector = 3614,

	/**
	 * txid snapshot
	 */
	txid_snapshot = 2970,

	/**
	 * UUID datatype
	 */
	uuid = 2950,

	/**
	 * Transaction id
	 */
	xid = 28,

	/**
	 * Full transaction id
	 */
	xid8 = 5069,

	/**
	 * XML content
	 */
	xml = 142,

	//* BitString

	/**
	 * Fixed-length bit string
	 */
	bit = 1560,

	/**
	 * Variable-length bit string
	 */
	varbit = 1562,

	//* Boolean

	/**
	 * boolean, `true`/`false`
	 */
	bool = 16,

	//* Geometric

	/**
	 * Geometric box '(lower left,upper right)'
	 */
	box = 603,

	/**
	 * Geometric circle '(center,radius)'
	 */
	circle = 718,

	/**
	 * Geometric line
	 */
	line = 628,

	/**
	 * Geometric line segment '(pt1,pt2)'
	 */
	lseg = 601,

	/**
	 * Geometric path '(pt1,...)'
	 */
	path = 602,

	/**
	 * Geometric point '(x, y)'
	 */
	point = 600,

	/**
	 * Geometric polygon '(pt1,...)'
	 */
	polygon = 604,

	//* String

	/**
	 * char(length), blank-padded string, fixed storage length
	 */
	bpchar = 1042,

	/**
	 * Single character
	 */
	char = 18,

	/**
	 * information_schema.character_data
	 */
	character_data = 13_408,

	/**
	 * 63-byte type for storing system identifiers
	 */
	name = 19,

	/**
	 * Multivariate dependencies
	 */
	pg_dependencies = 3402,

	/**
	 * Multivariate MCV list
	 */
	pg_mcv_list = 5017,

	/**
	 * Multivariate ndistinct coefficients
	 */
	pg_ndistinct = 3361,

	/**
	 * String representing an internal node tree
	 */
	pg_node_tree = 194,

	/**
	 * Variable-length string, no limit specified
	 */
	text = 25,

	/**
	 * varchar(length), non-blank-padded string, variable storage length
	 */
	varchar = 1043,

	//* NetworkAddress

	/**
	 * Network IP address/netmask, network address
	 */
	cidr = 650,

	/**
	 * IP address/netmask, host address, netmask optional
	 */
	inet = 869,

	//* Range

	/**
	 * Multivariate range of dates
	 */
	datemultirange = 4535,

	/**
	 * Range of dates
	 */
	daterange = 3912,

	/**
	 * Multivariate range of integers
	 */
	int4multirange = 4451,

	/**
	 * Range of integers
	 */
	int4range = 3904,

	/**
	 * Multivariate range of bigints
	 */
	int8multirange = 4536,

	/**
	 * Range of bigints
	 */
	int8range = 3926,

	/**
	 * Range of numerics
	 */
	numrange = 3906,

	/**
	 * Multirange of numerics
	 */
	nummultirange = 4532,

	/**
	 * Range of timestamps without time zone
	 */
	tsrange = 3908,

	/**
	 * Multirange of timestamps without time zone
	 */
	tsmultirange = 4533,

	/**
	 * Range of timestamps with time zone
	 */
	tstzrange = 3910,

	/**
	 * Multirange of timestamps with time zone
	 */
	tstzmultirange = 4534,

	//* Numeric

	/**
	 * information_schema.cardinal_number
	 */
	cardinal_number = 13_405,

	/**
	 * Single-precision floating point number, 4-byte storage
	 */
	float4 = 700,

	/**
	 * Double-precision floating point number, 8-byte storage
	 */
	float8 = 701,

	/**
	 * -32 thousand to 32 thousand, 2-byte storage
	 */
	int2 = 21,

	/**
	 * -2 billion to 2 billion integer, 4-byte storage
	 */
	int4 = 23,

	/**
	 * ~18 digit integer, 8-byte storage
	 */
	int8 = 20,

	/**
	 * Monetary amounts, $d,ddd.cc
	 */
	money = 790,

	/**
	 * numeric(precision, decimal), arbitrary precision number
	 */
	numeric = 1700,

	/**
	 * Object identifier(oid), maximum 4 billion
	 */
	oid = 26,

	/**
	 * Registered class
	 */
	regclass = 2205,

	/**
	 * Registered collation
	 */
	regcollation = 4191,

	/**
	 * Registered text search configuration
	 */
	regconfig = 3734,

	/**
	 * Registered text search dictionary
	 */
	regdictionary = 3769,

	/**
	 * Registered namespace
	 */
	regnamespace = 4089,

	/**
	 * Registered operator
	 */
	regoper = 2203,

	/**
	 * Registered operator (with args)
	 */
	regoperator = 2204,

	/**
	 * Registered procedure
	 */
	regproc = 24,

	/**
	 * Registered procedure (with args)
	 */
	regprocedure = 2202,

	/**
	 * Registered role
	 */
	regrole = 4096,

	/**
	 * Registered type
	 */
	regtype = 2206,

	//* Timespan

	/**
	 * @ <number> <units>, time interval
	 */
	interval = 1186,

	/**
	 * Relative, limited-range time interval (Unix delta time)
	 */
	reltime = 703,

	/**
	 * (abstime,abstime), time interval
	 */
	tinterval = 704,

	//* BRIN

	/**
	 * BRIN bloom summary
	 */
	pg_brin_bloom_summary = 4600,

	/**
	 * BRIN minmax-multi summary
	 */
	pg_brin_minmax_multi_summary = 4601,

	//* Unknown

	/**
	 * Pseudo-type representing an undetermined type
	 */
	unknown = 705,
}

export type DataTypes = keyof typeof DataType;
