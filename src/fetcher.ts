// src/fetcher.ts — GitHub REST API fetcher for repo statistics.

export interface RepoStats {
  name: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  language: string;
}

/**
 * Fetch repository statistics from the GitHub REST API.
 *
 * @param repo  Full "owner/repo" slug, e.g. "mitosisdev/repocard"
 * @param token Optional GitHub personal-access token for authenticated requests
 *              (higher rate limits, access to private repos)
 */
export async function fetchRepoStats(
  repo: string,
  token?: string
): Promise<RepoStats> {
  const url = `https://api.github.com/repos/${repo}`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });

  if (response.status === 404) {
    throw new Error(`repo not found: ${repo}`);
  }

  if (response.status === 403 || response.status === 429) {
    throw new Error("GitHub rate limit hit — provide a token");
  }

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await response.json()) as Record<string, any>;

  return {
    name: data.name as string,
    description: (data.description as string) ?? "",
    stars: data.stargazers_count as number,
    forks: data.forks_count as number,
    watchers: data.subscribers_count as number,
    language: (data.language as string) ?? "",
  };
}
