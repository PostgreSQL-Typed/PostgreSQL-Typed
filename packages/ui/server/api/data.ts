import generate from "@postgresql-typed/cli";

export default defineEventHandler(async () => {
	try {
		return await generateData();
	} catch (e) {
		if (!(e instanceof Error)) return;

		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error",
			message: e.message,
			stack: "",
		});
	}
});

export async function generateData() {
	return await generate({
		noConsoleLogs: true,
		throwOnError: true,
		returnDebug: true,
	});
}
