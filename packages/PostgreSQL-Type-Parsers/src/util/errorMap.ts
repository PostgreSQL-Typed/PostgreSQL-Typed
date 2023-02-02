import defaultErrorMap from "../locales/en";
import type { ErrorMap } from "./PGTPError";

let overrideErrorMap = defaultErrorMap;
export { defaultErrorMap };

export const setErrorMap = (map: ErrorMap) => {
	overrideErrorMap = map;
};

export const getErrorMap = () => {
	return overrideErrorMap;
};
