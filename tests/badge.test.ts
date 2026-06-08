import { describe, it, expect } from "bun:test";
import { generateBadge } from "../src/badge";

const sampleStats = {
  name: "test-repo",
  stars: 42,
  language: "TypeScript",
};

describe("generateBadge", () => {
  it("returns a string starting with <svg", () => {
    const result = generateBadge(sampleStats);
    expect(result).toBeTypeOf("string");
    expect(result.trimStart()).toMatch(/^<svg/);
  });

  it("has correct dimensions (280x80)", () => {
    const result = generateBadge(sampleStats);
    expect(result).toContain('width="280"');
    expect(result).toContain('height="80"');
  });

  it("contains the repo name", () => {
    const result = generateBadge(sampleStats);
    expect(result).toContain("test-repo");
  });

  it("contains the star count", () => {
    const result = generateBadge(sampleStats);
    expect(result).toContain("42");
  });

  it("contains the language", () => {
    const result = generateBadge(sampleStats);
    expect(result).toContain("TypeScript");
  });

  it("uses the dark theme background", () => {
    const result = generateBadge(sampleStats);
    expect(result).toContain("#0d1117");
  });

  it("is self-contained (no external URLs)", () => {
    const result = generateBadge(sampleStats);
    expect(result).not.toMatch(/href=["']https?:\/\//);
    expect(result).not.toMatch(/src=["']https?:\/\//);
  });

  it("closes the svg tag properly", () => {
    const result = generateBadge(sampleStats);
    expect(result).toContain("</svg>");
  });

  it("handles a null language gracefully", () => {
    const result = generateBadge({ name: "no-lang", stars: 5, language: null });
    expect(result.trimStart()).toMatch(/^<svg/);
    expect(result).toContain("no-lang");
    expect(result).toContain("5");
  });

  it("formats large star counts with k suffix", () => {
    const result = generateBadge({ name: "big-repo", stars: 12500, language: "Go" });
    expect(result).toContain("12.5k");
  });

  it("escapes XML special characters in the name", () => {
    const result = generateBadge({ name: "a&b<c>", stars: 1, language: "C" });
    expect(result).toContain("a&amp;b&lt;c&gt;");
    expect(result).not.toContain("a&b<c>");
  });
});
