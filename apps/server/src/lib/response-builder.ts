import type {ZodSchema} from "zod";
import type HTTP_STATUS_CODES from "@/lib/http-status-codes.js";
import {
	forbiddenResponse,
	internalServerErrorResponse,
	unprocessableEntityResponse,
} from "./schema-helpers.js";

type HTTPStatusCode =
	(typeof HTTP_STATUS_CODES)[keyof typeof HTTP_STATUS_CODES];

type GenericResponse = {
	[key in HTTPStatusCode]?: {
		content: {
			"application/json": {
				schema: ZodSchema;
			};
		};
		description: string | undefined;
	};
};

export class ResponseBuilder {
	static base<TResponse extends GenericResponse>(responses: TResponse) {
		return Object.assign(responses, internalServerErrorResponse);
	}

	static withAuthAndValidation<TResponse extends GenericResponse>(
		responses: TResponse,
	) {
		return Object.assign(
			responses,
			internalServerErrorResponse,
			forbiddenResponse,
			unprocessableEntityResponse,
		);
	}
}
