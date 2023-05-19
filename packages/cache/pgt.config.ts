import { definePgTConfig } from "@postgresql-typed/cli/config";

export default definePgTConfig({
	core: {
		extensions: ["~/index.ts"],
	},
});
