import generate from "@postgresql-typed/cli";

export default defineEventHandler(async event => {
	try {
		const a = await generate({
			noConsoleLogs: true,
			throwOnError: true,
			returnDebug: true,
		});
		console.log("success", a);
	} catch (e) {
		console.log("it failed", e);
	}

	return "Hello test";
});
