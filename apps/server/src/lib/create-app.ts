import {OpenAPIHono} from "@hono/zod-openapi";
import {cors} from "hono/cors";
import type {StatusCode} from "hono/utils/http-status";
import {env} from "@/env.js";
import HTTP_STATUS_CODES from "@/lib/http-status-codes.js";
import type {AppBindings} from "@/types/app-types.js";
import {PermissionError, UnprocessableEntityError} from "./error-utils.js";
import {pinoLogger} from "hono-pino";
import pino from "pino";

export default function createApp() {
  const appRouter = new OpenAPIHono<AppBindings>();

  appRouter.use(
    pinoLogger({
      pino: pino({
        base: null,
        level: "trace",
        transport: {
          target: "hono-pino/debug-log",
        },
        timestamp: pino.stdTimeFunctions.isoTime, // hh:mm:ss
      }),
    }),
  );

  appRouter.use(
    "/*",
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    }),
  );

  appRouter.notFound((c) => {
    return c.json(
      {
        message: `${c.req.path} route not found`,
      },
      HTTP_STATUS_CODES.NOT_FOUND,
    );
  });

  appRouter.onError((err, c) => {
    const isDevelopment = env.NODE_ENV !== "production";
    let statusCode: StatusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    let message =
      "An unexpected error occurred, Please contact support if the problem persists.";

    if (err instanceof PermissionError) {
      statusCode = HTTP_STATUS_CODES.FORBIDDEN;
      message = err.message;
    }

    if (err instanceof UnprocessableEntityError) {
      statusCode = HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY;
      message = err.message;
    }

    const data = {
      message,
      stack: err instanceof Error && isDevelopment ? err.stack : undefined,
      statusCode,
    };

    return c.json(data, statusCode);
  });

  return appRouter;
}
