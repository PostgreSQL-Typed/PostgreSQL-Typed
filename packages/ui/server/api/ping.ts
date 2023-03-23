import { version } from "@/package.json";

export default defineEventHandler(async event => {
	setResponseHeader(event, "Content-Type", "text/plain; charset=utf-8");
	setResponseHeader(event, "Version", version);
	return "Pong!";
});
