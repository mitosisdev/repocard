import { describe, it, expect } from "bun:test";
import { renderCard } from "../src/renderer";
import type { RepoStats } from "../src/types";

const sampleStats: RepoStats = {
  name: "mitosisdev/gitstory",
  description: "A beautiful git history visualizer",
  stars: 142,
  forks: 23,
  watchers: 8,
  language: "TypeScript",
};

describe("renderCard", () => {
  it("returns a valid SVG string (starts with <svg, ends with </svg>)", () => {
    const svg = renderCard(sampleStats);
    expect(svg.trimStart()).toMatch(/^<svg/);
    expect(svg.trimEnd()).toMatch(/<\/svg>$/);
  });

  it("includes the repo name in the output", () => {
    const svg = renderCard(sampleStats);
    expect(svg).toContain("mitosisdev/gitstory");
  });

  it("includes the star count in the output", () => {
    const svg = renderCard(sampleStats);
    expect(svg).toContain("142");
  });

  it("has canvas dimensions 400×160", () => {
    const svg = renderCard(sampleStats);
    expect(svg).toContain('width="400"');
    expect(svg).toContain('height="160"');
  });
});
