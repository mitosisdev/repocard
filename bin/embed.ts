#!/usr/bin/env bun
/**
 * bin/embed.ts — Generate a markdown embed snippet for a GitHub repo using repocard.
 *
 * Usage:
 *   bun bin/embed.ts <owner/repo>
 *   bun bin/embed.ts mitosisdev/repocard
 *
 * Output (example):
 *   [![repocard](https://repocard.dev/api/card?repo=mitosisdev/repocard)](https://github.com/mitosisdev/repocard)
 */

export const REPOCARD_BASE_URL = "https://repocard.dev/api/card";

/**
 * Generate a markdown image embed that links to the repo.
 *
 * @param repo   Full "owner/repo" slug, e.g. "mitosisdev/repocard"
 * @param base   Override the repocard API base URL (for testing / self-hosting)
 * @returns Markdown string: [![repocard](card-url)](repo-url)
 */
export function generateEmbed(repo: string, base = REPOCARD_BASE_URL): string {
  if (!repo || !repo.includes("/")) {
    throw new Error(`Invalid repo format — expected "owner/repo", got: ${JSON.stringify(repo)}`);
  }

  const [owner, name] = repo.split("/");
  if (!owner || !name) {
    throw new Error(`Invalid repo format — expected "owner/repo", got: ${JSON.stringify(repo)}`);
  }

  const cardUrl = `${base}?repo=${encodeURIComponent(repo)}`;
  const repoUrl = `https://github.com/${repo}`;

  return `[![repocard](${cardUrl})](${repoUrl})`;
}

// CLI entrypoint — only runs when executed directly
if (import.meta.main) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    console.error("Usage: bun bin/embed.ts <owner/repo>");
    console.error("  Example: bun bin/embed.ts mitosisdev/repocard");
    console.error("");
    console.error("Outputs a markdown embed snippet:");
    console.error("  [![repocard](https://repocard.dev/api/card?repo=owner/repo)](https://github.com/owner/repo)");
    process.exit(args.length === 0 ? 1 : 0);
  }

  const repo = args[0];

  try {
    const snippet = generateEmbed(repo);
    console.log(snippet);
  } catch (err) {
    console.error(`Error: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }
}
