import type {Context as HonoContext} from "hono";
import {auth} from "@/lib/auth.js";

export type CreateContextOptions = {
	context: HonoContext;
};

export async function createContext({context}: CreateContextOptions) {
	const session = await auth.api.getSession({
		headers: context.req.raw.headers,
	});

	return {user: session?.user, session: session?.session};
}

export type Context = {session: Awaited<ReturnType<typeof createContext>>};
