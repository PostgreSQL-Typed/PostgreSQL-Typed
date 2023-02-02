import { rm } from "node:fs/promises";
import { resolve } from "node:path";

(async () => {
	await rm(resolve("../../__tests__/__generated__"), { recursive: true });
})();
