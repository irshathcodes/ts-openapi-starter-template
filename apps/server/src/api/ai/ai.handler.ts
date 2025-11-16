import {openai} from "@ai-sdk/openai";
import {convertToModelMessages, streamText} from "ai";
import {and, eq} from "drizzle-orm";
import type {TypedResponse} from "hono";
import {db} from "@/db/index.js";
import {accounts} from "@/db/schema/auth.js";
import {GitHubUserService} from "@/lib/github.js";
import HTTP_STATUS_CODES from "@/lib/http-status-codes.js";
import type {InferHandlers} from "@/types/app-types.js";
import type routes from "./ai.routes.js";

const handlers: InferHandlers<typeof routes> = {
  getRecap: async (c) => {
    const user = c.var.authCtx.user;

    const githubAccount = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.userId, user.id),
        eq(accounts.providerId, "github"),
      ),
      columns: {
        accessToken: true,
      },
    });

    if (!githubAccount || !githubAccount.accessToken) {
      throw new Error("GitHub token not found");
    }

    const githubService = new GitHubUserService(githubAccount.accessToken);
    const pullRequests = await githubService.getUserPullRequestsByDays();

    // return c.json(pullRequests, HTTP_STATUS_CODES.OK);

    const response = await streamText({
      model: openai("gpt-5"),
      prompt: `Here's the list of pull requests with their details: ${JSON.stringify(
        pullRequests,
      )}`,

      system: `You are a summarizer of workrecap.ai app. You are given a list of github pull requests that were created in the last 7 days, you're job is to summarize the pull requests in a way that is easy to understand and use for the user. This is to give updates on the user's work and progress `,
    });

    return response.toUIMessageStreamResponse() as unknown as TypedResponse<
      any,
      200,
      "json"
    >;
  },
  chat: async (c) => {
    const body = c.req.valid("json");
    const uiMessages = body.messages || [];
    const result = streamText({
      model: openai("gpt-5"),
      messages: convertToModelMessages(uiMessages),
    });

    return result.toUIMessageStreamResponse() as unknown as TypedResponse<
      any,
      200,
      "json"
    >;
  },
  getGithubStatus: async (c) => {
    const user = c.var.authCtx.user;

    const githubAccount = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.userId, user.id),
        eq(accounts.providerId, "github"),
      ),
      columns: {
        accessToken: true,
      },
    });

    if (!githubAccount || !githubAccount.accessToken) {
      return c.json(
        {
          connected: false,
        },
        HTTP_STATUS_CODES.OK,
      );
    }

    try {
      const githubService = new GitHubUserService(githubAccount.accessToken);
      const username = await githubService.getAuthenticatedUser();

      return c.json(
        {
          connected: true,
          username,
        },
        HTTP_STATUS_CODES.OK,
      );
    } catch (error) {
      return c.json(
        {
          connected: false,
        },
        HTTP_STATUS_CODES.OK,
      );
    }
  },
};

export default handlers;
