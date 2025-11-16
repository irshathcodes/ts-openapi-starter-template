import {createRoute, z} from "@hono/zod-openapi";
import HTTP_STATUS_CODES from "@/lib/http-status-codes.js";
import {ResponseBuilder} from "@/lib/response-builder.js";
import {jsonContent, jsonContentRequired} from "@/lib/schema-helpers.js";

const routes = {
	getRecap: createRoute({
		method: "post",
		path: "/recap",
		responses: ResponseBuilder.withAuthAndValidation({
			[HTTP_STATUS_CODES.OK]: jsonContent(z.any()),
		}),
	}),
	chat: createRoute({
		method: "post",
		path: "/chat",
		request: {
			body: jsonContentRequired(
				z.object({
					messages: z.array(z.any()),
				}),
			),
		},
		responses: ResponseBuilder.withAuthAndValidation({
			[HTTP_STATUS_CODES.OK]: jsonContent(z.any()),
		}),
	}),
	getGithubStatus: createRoute({
		method: "get",
		path: "/github-status",
		responses: ResponseBuilder.withAuthAndValidation({
			[HTTP_STATUS_CODES.OK]: jsonContent(
				z.object({
					connected: z.boolean(),
					username: z.string().optional(),
				}),
			),
		}),
	}),
};

export default routes;
