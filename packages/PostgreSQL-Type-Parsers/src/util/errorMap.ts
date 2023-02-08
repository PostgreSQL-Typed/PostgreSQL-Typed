import defaultErrorMap from "../locales/en.js";
import type { ErrorMap } from "./PGTPError.js";

let overrideErrorMap = defaultErrorMap;

export const setErrorMap = (map: ErrorMap) => {
	overrideErrorMap = map;
};

export const getErrorMap = () => {
	return overrideErrorMap;
};

export { default as defaultErrorMap } from "../locales/en.js";
