import { describe, it, expect } from "bun:test";
import { generateEmbed, REPOCARD_BASE_URL } from "../bin/embed";

describe("generateEmbed", () => {
  it("returns a markdown image link", () => {
    const result = generateEmbed("mitosisdev/repocard");
    expect(result).toBeTypeOf("string");
    expect(result).toMatch(/^\[!\[repocard\]\(.*\)\]\(.*\)$/);
  });

  it("includes the card URL with repo query param", () => {
    const result = generateEmbed("mitosisdev/repocard");
    expect(result).toContain("?repo=mitosisdev%2Frepocard");
  });

  it("includes the GitHub repo URL as link target", () => {
    const result = generateEmbed("mitosisdev/repocard");
    expect(result).toContain("(https://github.com/mitosisdev/repocard)");
  });

  it("uses the default repocard base URL", () => {
    const result = generateEmbed("mitosisdev/repocard");
    expect(result).toContain(REPOCARD_BASE_URL);
  });

  it("accepts a custom base URL", () => {
    const result = generateEmbed("mitosisdev/repocard", "https://my-repocard.example.com/api");
    expect(result).toContain("https://my-repocard.example.com/api?repo=mitosisdev%2Frepocard");
    expect(result).not.toContain(REPOCARD_BASE_URL);
  });

  it("works with any owner/repo slug", () => {
    const result = generateEmbed("vercel/next.js");
    expect(result).toContain("vercel%2Fnext.js");
    expect(result).toContain("https://github.com/vercel/next.js");
  });

  it("throws on missing slash", () => {
    expect(() => generateEmbed("noslash")).toThrow(/owner\/repo/);
  });

  it("throws on empty string", () => {
    expect(() => generateEmbed("")).toThrow();
  });

  it("produces valid markdown — image alt text is 'repocard'", () => {
    const result = generateEmbed("owner/repo");
    expect(result).toMatch(/\[!\[repocard\]/);
  });

  it("full snapshot for mitosisdev/repocard", () => {
    const result = generateEmbed("mitosisdev/repocard");
    expect(result).toBe(
      "[![repocard](https://repocard.dev/api/card?repo=mitosisdev%2Frepocard)](https://github.com/mitosisdev/repocard)"
    );
  });
});
