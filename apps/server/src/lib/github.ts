import {Octokit} from "octokit";
import {z} from "zod";

const pullRequestSchema = z.object({
  title: z.string(),
  number: z.number(),
  url: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  state: z.enum(["open", "closed", "merged", "draft"]),
  body: z.string().nullable(),
});

const pullRequestListSchema = z.array(pullRequestSchema);

export class GitHubUserService {
  private octokit: Octokit;
  private token: string;

  constructor(token: string) {
    this.token = token;
    this.octokit = new Octokit({
      auth: this.token,
    });
  }

  async getAuthenticatedUser() {
    const response = await this.octokit.rest.users.getAuthenticated();
    return response.data.login; // GitHub username
  }

  async checkTokenScopes() {
    try {
      // Make a request to check token scopes
      const response = await this.octokit.request("GET /user", {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      const scopes = response.headers["x-oauth-scopes"];
      console.log("Token scopes:", scopes);
      return scopes;
    } catch (error) {
      console.error("Failed to check token scopes:", error);
      return null;
    }
  }

  async getUserPullRequestsByDays({days = 100}: {days?: number} = {}) {
    const username = await this.getAuthenticatedUser();
    const range = getDateRange(days);
    const q = `type:pr author:${username} created:${range.startDate}..${range.endDate}`;
    // const date = "2025-09-06";
    // const q = `type:pr author:${username} created:>=${date}`;
    console.log("Using token:", this.token.substring(0, 10) + "...");

    // First, let's test the token permissions
    try {
      const userInfo = await this.octokit.rest.users.getAuthenticated();
      console.log("Authenticated user:", userInfo.data.login);

      // Check token scopes
      await this.checkTokenScopes();

      // Test if we can access private repos by listing user's repos
      const repos = await this.octokit.rest.repos.listForAuthenticatedUser({
        visibility: "private",
        per_page: 5,
      });
      console.log("Private repos accessible:", repos.data.length);
    } catch (error) {
      console.error("Token permission test failed:", error);
    }

    const res = await this.octokit.request("GET /search/issues", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
        "Authorization": `${this.token}`,
      },
      order: "desc",
      advanced_search: "true",
      q,
    });

    console.log("res: ", res.data.items);

    const data = pullRequestListSchema.parse(res.data.items);
    return data;
  }
}

function getDateRange(days: number): {
  startDate: string;
  endDate: string;
} {
  const endDate = new Date();

  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
  return {
    startDate: startDate.toISOString().split("T")[0]!,
    endDate: endDate.toISOString().split("T")[0]!,
  };
}
