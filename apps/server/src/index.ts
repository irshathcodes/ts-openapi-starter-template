import app from "@/app.js";
import {env} from "@/env.js";

export default {
	fetch: app.fetch,
	idleTimeout: 120,
	port: env.PORT,
};
