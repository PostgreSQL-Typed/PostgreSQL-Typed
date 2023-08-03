import auth from "basic-auth";

export default defineEventHandler(event => {
	const { res } = event.node,
		{ req } = event.node,
		user = auth.parse(req.headers.authorization || ""),
		hasAuthSet = !!process.env.ROOT_USER && !!process.env.ROOT_PASSWORD;

	if (hasAuthSet && (!user || user.name !== process.env.ROOT_USER || user.pass !== process.env.ROOT_PASSWORD)) {
		res.statusCode = 401;
		res.setHeader("WWW-Authenticate", 'Basic realm="Please enter username and password"');
		res.end("Access denied");
	}
});
