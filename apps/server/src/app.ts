import {Scalar} from "@scalar/hono-api-reference";
import aiRouter from "@/api/ai/ai.index.js";
import authRouter from "@/api/auth/auth.index.js";
import createApp from "./lib/create-app.js";

const app = createApp();

app.get("/", (c) => c.text("OK"));

app.doc("/doc", {
	openapi: "3.0.0",
	info: {
		version: "0.0.1",
		title: "Hono + Drizzle API",
	},
});

app.get("/reference", Scalar({url: "/doc"}));

const routes = [authRouter, aiRouter];

routes.forEach((route) => {
	app.route("/api", route);
});

export default app;
