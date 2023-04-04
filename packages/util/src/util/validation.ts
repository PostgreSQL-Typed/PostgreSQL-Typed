export type INVALID = { status: "invalid" };
export const INVALID: INVALID = Object.freeze({
	status: "invalid",
});

export type OK<DataType> = { status: "valid"; value: DataType };
export const OK = <DataType>(value: DataType): OK<DataType> => ({
	status: "valid",
	value,
});

export type ParseReturnType<DataType> = OK<DataType> | INVALID;

export const isValid = <DataType>(x: ParseReturnType<DataType>): x is OK<DataType> => x.status === "valid";
