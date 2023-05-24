import type { ErrorMap } from "@postgresql-typed/util";

import defaultErrorMap from "../locales/en.js";

let overrideErrorMap: ErrorMap = defaultErrorMap;

export const setErrorMap = (map: ErrorMap): void => {
	overrideErrorMap = map;
};

export const getErrorMap = (): ErrorMap => {
	return overrideErrorMap;
};

export { default as defaultErrorMap } from "../locales/en.js";
