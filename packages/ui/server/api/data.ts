import generate from "@postgresql-typed/cli";

export default defineEventHandler(async () => {
	try {
		const result = await generateData();
		return result.map(r => ({
			...r,

			id: encodeURIComponent(`${r.hostPort}/${r.database}`),
		}));
	} catch (error) {
		if (!(error instanceof Error)) return;

		throw createError({
			message: error.message,
			stack: "",
			statusCode: 500,
			statusMessage: "Internal Server Error",
		});
	}
});

export async function generateData() {
	return await generate({
		noFiles: true,
		onError: "throwNewError",
		returnDebug: true,
		silent: true,
	});
}
