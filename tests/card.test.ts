import { describe, it, expect } from "bun:test";
import { generateCard } from "../src/card";

const sampleRepo = {
  name: "mitosisdev/gitstory",
  description: "Git history as a story",
  stars: 142,
  forks: 18,
  language: "TypeScript",
  url: "https://github.com/mitosisdev/gitstory",
};

describe("generateCard", () => {
  it("returns a string starting with <svg", () => {
    const result = generateCard(sampleRepo);
    expect(result).toBeTypeOf("string");
    expect(result.trimStart()).toMatch(/^<svg/);
  });

  it("contains the repo name", () => {
    const result = generateCard(sampleRepo);
    expect(result).toContain("mitosisdev/gitstory");
  });

  it("contains the star count", () => {
    const result = generateCard(sampleRepo);
    expect(result).toContain("142");
  });

  it("contains the language", () => {
    const result = generateCard(sampleRepo);
    expect(result).toContain("TypeScript");
  });

  it("has correct dimensions (400x150)", () => {
    const result = generateCard(sampleRepo);
    expect(result).toContain('width="400"');
    expect(result).toContain('height="150"');
  });

  it("is self-contained (no external URLs)", () => {
    const result = generateCard(sampleRepo);
    // Must not reference external resources (fonts via URL, images via http, etc.)
    expect(result).not.toMatch(/href=["']https?:\/\//);
    expect(result).not.toMatch(/src=["']https?:\/\//);
    // Background color present
    expect(result).toContain("#0d1117");
  });

  it("contains fork count", () => {
    const result = generateCard(sampleRepo);
    expect(result).toContain("18");
  });

  it("closes the svg tag properly", () => {
    const result = generateCard(sampleRepo);
    expect(result).toContain("</svg>");
  });
});
