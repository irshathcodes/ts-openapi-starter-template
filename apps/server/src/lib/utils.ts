import {randomUUID} from "node:crypto";
import type {OpenAPIHono, RouteConfig} from "@hono/zod-openapi";
import type {Handler} from "hono";
import type {
	AppBindings,
	InferHandlers,
	InferMiddlewares,
} from "@/types/app-types.js";

/**
 * Register routes and their handlers to a router in a type-safe way
 * @param router - The router instance to register routes to
 * @param routes - The route definitions
 * @param middlewares - The middlewares for the routes
 * @param handlers - The handlers for the routes
 *
 * @example
 * const router = createAuthenticatedRouter();
 * registerRouteHandlers(router, routes, middlewares, handlers);
 */
export function registerRouteHandlers<
	TRoutes extends Record<string, RouteConfig>,
>(
	router: OpenAPIHono<AppBindings>,
	routes: TRoutes,
	middlewares: InferMiddlewares<TRoutes> | undefined,
	handlers: InferHandlers<TRoutes>,
) {
	(Object.keys(routes) as Array<keyof TRoutes>).forEach((key) => {
		let routeConfig = routes[key];
		const middleware = middlewares?.[key] ?? [];

		if (middleware?.length) {
			routeConfig = {...routeConfig, middleware};
		}

		router.openapi(routeConfig, handlers[key] as Handler<AppBindings>);
	});
}
