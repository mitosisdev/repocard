#!/usr/bin/env bun
import { writeFileSync } from "fs";
import { renderCard } from "./renderer";
import type { RepoStats } from "./types";

const arg = process.argv[2];

if (!arg) {
  console.error("Usage: repocard <owner/repo>");
  console.error("Example: repocard mitosisdev/gitstory");
  process.exit(1);
}

// Demo/hardcoded stats — no GitHub token required
const stats: RepoStats = {
  name: arg,
  description: "A GitHub repository",
  stars: 0,
  forks: 0,
  watchers: 0,
  language: "TypeScript",
};

const svg = renderCard(stats);
writeFileSync("card.svg", svg, "utf8");
console.log("✓ wrote card.svg");
