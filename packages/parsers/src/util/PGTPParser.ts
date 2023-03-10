/* eslint-disable unicorn/filename-case */
//* BitString
import type { BitConstructor } from "../data/BitString/Bit.js";
import type { BitVaryingConstructor } from "../data/BitString/BitVarying.js";
//* Character
import type { CharacterConstructor } from "../data/Character/Character.js";
import type { CharacterVaryingConstructor } from "../data/Character/CharacterVarying.js";
import type { NameConstructor } from "../data/Character/Name.js";
import type { TextConstructor } from "../data/Character/Text.js";
//* DateTime
import type { DateConstructor } from "../data/DateTime/Date.js";
import type { DateMultiRangeConstructor } from "../data/DateTime/DateMultiRange.js";
import type { DateRangeConstructor } from "../data/DateTime/DateRange.js";
import type { IntervalConstructor } from "../data/DateTime/Interval.js";
import type { TimeConstructor } from "../data/DateTime/Time.js";
import type { TimestampConstructor } from "../data/DateTime/Timestamp.js";
import type { TimestampMultiRangeConstructor } from "../data/DateTime/TimestampMultiRange.js";
import type { TimestampRangeConstructor } from "../data/DateTime/TimestampRange.js";
import type { TimestampTZConstructor } from "../data/DateTime/TimestampTZ.js";
import type { TimestampTZMultiRangeConstructor } from "../data/DateTime/TimestampTZMultiRange.js";
import type { TimestampTZRangeConstructor } from "../data/DateTime/TimestampTZRange.js";
import type { TimeTZConstructor } from "../data/DateTime/TimeTZ.js";
//* Geometric
import type { BoxConstructor } from "../data/Geometric/Box.js";
import type { CircleConstructor } from "../data/Geometric/Circle.js";
import type { LineConstructor } from "../data/Geometric/Line.js";
import type { LineSegmentConstructor } from "../data/Geometric/LineSegment.js";
import type { PathConstructor } from "../data/Geometric/Path.js";
import type { PointConstructor } from "../data/Geometric/Point.js";
import type { PolygonConstructor } from "../data/Geometric/Polygon.js";
//* Monetary
import type { MoneyConstructor } from "../data/Monetary/Money.js";
//* NetworkAddress
// import type { IPAddressConstructor } from "../data/NetworkAddress/IPAddress.js";
// import type { MACAddressConstructor } from "../data/NetworkAddress/MACAddress.js";
// import type { MACAddress8Constructor } from "../data/NetworkAddress/MACAddress8.js";
//* Numeric
import type { Float4Constructor } from "../data/Numeric/Float4.js";
import type { Float8Constructor } from "../data/Numeric/Float8.js";
import type { Int2Constructor } from "../data/Numeric/Int2.js";
import type { Int4Constructor } from "../data/Numeric/Int4.js";
import type { Int4MultiRangeConstructor } from "../data/Numeric/Int4MultiRange.js";
import type { Int4RangeConstructor } from "../data/Numeric/Int4Range.js";
import type { Int8Constructor } from "../data/Numeric/Int8.js";
import type { Int8MultiRangeConstructor } from "../data/Numeric/Int8MultiRange.js";
import type { Int8RangeConstructor } from "../data/Numeric/Int8Range.js";
//* ObjectIdentifier
import type { OIDConstructor } from "../data/ObjectIdentifier/OID.js";
//* UUID
import type { UUIDConstructor } from "../data/UUID/UUID.js";
import type { ObjectFunction } from "../types/ObjectFunction.js";

type Parsers =
	//* BitString
	| BitConstructor<number>
	| BitVaryingConstructor<number>
	//* Character
	| CharacterConstructor<number>
	| CharacterVaryingConstructor<number>
	| NameConstructor
	| TextConstructor
	//* DateTime
	| DateConstructor
	| DateMultiRangeConstructor
	| DateRangeConstructor
	| IntervalConstructor
	| TimeConstructor
	| TimestampConstructor
	| TimestampMultiRangeConstructor
	| TimestampRangeConstructor
	| TimestampTZConstructor
	| TimestampTZMultiRangeConstructor
	| TimestampTZRangeConstructor
	| TimeTZConstructor
	//* Geometric
	| BoxConstructor
	| CircleConstructor
	| LineConstructor
	| LineSegmentConstructor
	| PathConstructor
	| PointConstructor
	| PolygonConstructor
	//* Monetary
	| MoneyConstructor
	//* NetworkAddress
	// | IPAddressConstructor
	// | MACAddressConstructor
	// | MACAddress8Constructor
	//* Numeric
	| Float4Constructor
	| Float8Constructor
	| Int2Constructor
	| Int4Constructor
	| Int4MultiRangeConstructor
	| Int4RangeConstructor
	| Int8Constructor
	| Int8MultiRangeConstructor
	| Int8RangeConstructor
	//* ObjectIdentifier
	| OIDConstructor
	//* UUID
	| UUIDConstructor
	| ObjectFunction<any>;

export const PGTPParser = <Parser extends Parsers | "unknown">(parser: Parser, isArray = false) => new PGTPParserClass(parser, isArray);

class PGTPParserClass<Parser extends Parsers | "unknown"> {
	_nullable = false;
	_optional = false;
	constructor(public parser: Parser, public isArray: boolean) {}

	nullable(): PGTPParserClass<Parser> {
		this._nullable = true;
		return this;
	}

	optional(): PGTPParserClass<Parser> {
		this._optional = true;
		return this;
	}

	isValid(value: unknown, inner = false): boolean {
		if (value === null) return !inner && this._nullable;
		if (value === undefined) return !inner && this._optional;
		if (!inner && this.isArray) return Array.isArray(value) && value.every(v => this.isValid(v, true));
		if (this.parser === "unknown") return true;
		return this.parser.safeFrom(value as any).success;
	}
}
