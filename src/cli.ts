#!/usr/bin/env bun
import { writeFileSync } from "fs";
import { resolve } from "path";
import { generateCard, type RepoData } from "./card";
import { generateBadge } from "./badge";

const rawArgs = process.argv.slice(2);

// Pull out flags, keeping positional args separate so existing usage is unchanged.
const badgeMode = rawArgs.includes("--badge");
const args = rawArgs.filter((a) => a !== "--badge");

if (rawArgs.length === 0 || rawArgs[0] === "--help" || rawArgs[0] === "-h") {
  console.error("Usage: repocard <owner/repo> [output.svg] [--badge]");
  console.error("  Example: repocard mitosisdev/gitstory");
  console.error("  Example: repocard mitosisdev/gitstory my-card.svg");
  console.error("  Example: repocard mitosisdev/gitstory --badge");
  console.error("  --badge   Generate a compact 280x80 badge instead of the full card");
  process.exit(rawArgs.length === 0 ? 1 : 0);
}

const repoArg = args[0];
const outputArg = args[1] ?? (badgeMode ? "repocard-badge.svg" : "repocard.svg");

if (!repoArg.includes("/")) {
  console.error(`Error: expected "owner/repo" format, got: ${repoArg}`);
  process.exit(1);
}

// Fetch repo data using gh CLI
async function fetchRepoData(repo: string): Promise<RepoData> {
  const proc = Bun.spawn(
    ["gh", "api", `repos/${repo}`, "--jq", "."],
    { stdout: "pipe", stderr: "pipe" }
  );

  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  const exitCode = await proc.exited;

  if (exitCode !== 0) {
    if (stderr.includes("authentication") || stderr.includes("auth") || stderr.includes("401")) {
      console.error("Error: gh CLI is not authenticated. Run: gh auth login");
    } else if (stderr.includes("404") || stderr.includes("Not Found")) {
      console.error(`Error: Repository "${repo}" not found.`);
    } else {
      console.error(`Error fetching repo data: ${stderr.trim() || "unknown error"}`);
      console.error("Make sure 'gh' CLI is installed and authenticated (gh auth login).");
    }
    process.exit(1);
  }

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(stdout);
  } catch {
    console.error("Error: Failed to parse GitHub API response.");
    process.exit(1);
  }

  return {
    name: String(data.full_name ?? repo),
    description: String(data.description ?? ""),
    stars: Number(data.stargazers_count ?? 0),
    forks: Number(data.forks_count ?? 0),
    language: String(data.language ?? ""),
    url: String(data.html_url ?? `https://github.com/${repo}`),
  };
}

async function main() {
  const repoData = await fetchRepoData(repoArg);
  const svg = badgeMode
    ? generateBadge({
        name: repoData.name,
        stars: repoData.stars,
        language: repoData.language || null,
      })
    : generateCard(repoData);

  const outputPath = resolve(process.cwd(), outputArg);
  writeFileSync(outputPath, svg, "utf-8");

  console.log(outputPath);
}

main().catch((err: unknown) => {
  console.error("Unexpected error:", err instanceof Error ? err.message : err);
  process.exit(1);
});
