import {type BetterAuthOptions, betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {db} from "@/db/index.js";
import schema from "@/db/schema/index.js";
import {env} from "@/env.js";

export const auth = betterAuth<BetterAuthOptions>({
	database: drizzleAdapter(db, {
		provider: "sqlite",
		usePlural: true,
		schema,
	}),
	trustedOrigins: [env.CORS_ORIGIN],
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			scope: ["user:email", "repo", "read:org"],
		},
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
	plugins: [
		// polar({
		//   client: polarClient,
		//   createCustomerOnSignUp: true,
		//   enableCustomerPortal: true,
		//   use: [
		//     checkout({
		//       products: [
		//         {
		//           productId: "your-product-id",
		//           slug: "pro",
		//         },
		//       ],
		//       successUrl: process.env.POLAR_SUCCESS_URL,
		//       authenticatedUsersOnly: true,
		//     }),
		//     portal(),
		//   ],
		// }),
	],
});
