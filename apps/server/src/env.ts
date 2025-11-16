import {z} from "zod";

const envSchema = z.object({
	CORS_ORIGIN: z.url(),
	DATABASE_URL: z.string(),
	BETTER_AUTH_SECRET: z.string(),
	BETTER_AUTH_URL: z.url(),
	GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
	OPENAI_API_KEY: z.string(),
	POLAR_ACCESS_TOKEN: z.string().optional(),
	POLAR_SUCCESS_URL: z.url().optional(),
	GITHUB_CLASSIC_TOKEN: z.string(),
	GITHUB_CLIENT_ID: z.string(),
	GITHUB_CLIENT_SECRET: z.string(),
	NODE_ENV: z.enum(["development", "production"]),
	PORT: z.coerce.number().optional(),
});

export const env = envSchema.parse(process.env);
