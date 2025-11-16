import {OpenAPIHono} from "@hono/zod-openapi";
import HTTP_STATUS_CODES from "@/lib/http-status-codes.js";
import {
	authenticatedMiddleware,
	verifySessionMiddleware,
} from "@/middlewares/auth-middlewares.js";
import type {AppBindings} from "@/types/app-types.js";

export function createRouter() {
	const router = new OpenAPIHono<AppBindings>({
		strict: false,
		defaultHook: (result, c) => {
			if (!result.success) {
				return c.json(
					{
						success: result.success,
						error: result.error,
					},
					HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY,
				);
			}
		},
	});

	return router;
}

export function createAuthenticatedRouter() {
	const router = createRouter();
	router.use(verifySessionMiddleware, authenticatedMiddleware);
	return router;
}
