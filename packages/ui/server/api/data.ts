import generate from "@postgresql-typed/cli";

export default defineEventHandler(async () => {
	try {
		const result = await generateData();
		return result.map(r => ({
			...r,
			...{
				id: encodeURIComponent(`${r.hostPort}/${r.database}`),
			},
		}));
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
		noFiles: true,
	});
}
