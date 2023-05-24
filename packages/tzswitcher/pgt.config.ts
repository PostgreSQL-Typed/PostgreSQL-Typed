import { definePgTConfig } from "@postgresql-typed/cli/config";

export default definePgTConfig({
	core: {
		extensions: ["~/index.ts"],
	},
	//@ts-expect-error - This is a valid config
	tzswitcher: {
		timestamp: {
			from: "UTC",
			to: "Asia/Seoul",
		},
		timestamptz: {
			from: "UTC",
			to: "Asia/Seoul",
		},
		time: {
			from: "UTC",
			to: "Asia/Seoul",
		},
		timetz: {
			from: "UTC",
			to: "Asia/Seoul",
		},
	},
});
