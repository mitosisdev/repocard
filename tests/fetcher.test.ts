// tests/fetcher.test.ts
import { test, expect, mock, beforeEach, afterEach } from "bun:test";
import type { RepoStats } from "../src/fetcher";

// --- fixture ---
const FIXTURE_RESPONSE = {
  name: "repocard",
  description: "Generate repo cards",
  stargazers_count: 5,
  forks_count: 2,
  subscribers_count: 3,
  language: "TypeScript",
};

// We intercept the global fetch used inside fetcher.ts
const mockFetch = mock(async (url: string, opts?: RequestInit) => {
  const u = typeof url === "string" ? url : (url as Request).url;

  if (u.includes("/repos/mitosisdev/repocard")) {
    return new Response(JSON.stringify(FIXTURE_RESPONSE), { status: 200 });
  }
  if (u.includes("/repos/does-not-exist/repo")) {
    return new Response(JSON.stringify({ message: "Not Found" }), {
      status: 404,
    });
  }
  if (u.includes("/repos/rate-limited/repo")) {
    return new Response(JSON.stringify({ message: "rate limit" }), {
      status: 403,
    });
  }
  return new Response("{}", { status: 200 });
});

// Patch global fetch before each test, restore after
const originalFetch = globalThis.fetch;
beforeEach(() => {
  globalThis.fetch = mockFetch as unknown as typeof fetch;
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  mockFetch.mockClear();
});

// --- tests ---

test("fetchRepoStats returns an object with required fields", async () => {
  const { fetchRepoStats } = await import("../src/fetcher");
  const stats = await fetchRepoStats("mitosisdev/repocard");

  expect(stats).toBeDefined();
  expect(typeof stats).toBe("object");
  expect(stats).toHaveProperty("name");
  expect(stats).toHaveProperty("description");
  expect(stats).toHaveProperty("stars");
  expect(stats).toHaveProperty("forks");
  expect(stats).toHaveProperty("watchers");
  expect(stats).toHaveProperty("language");
});

test("fetchRepoStats maps API fields correctly", async () => {
  const { fetchRepoStats } = await import("../src/fetcher");
  const stats = await fetchRepoStats("mitosisdev/repocard");

  expect(stats.name).toBe("repocard");
  expect(stats.description).toBe("Generate repo cards");
  expect(stats.stars).toBe(5);
  expect(stats.forks).toBe(2);
  expect(stats.watchers).toBe(3);
  expect(stats.language).toBe("TypeScript");
});

test("stars is a number >= 0", async () => {
  const { fetchRepoStats } = await import("../src/fetcher");
  const stats = await fetchRepoStats("mitosisdev/repocard");

  expect(typeof stats.stars).toBe("number");
  expect(stats.stars).toBeGreaterThanOrEqual(0);
});

test("fetchRepoStats throws on 404 (repo not found)", async () => {
  const { fetchRepoStats } = await import("../src/fetcher");

  await expect(
    fetchRepoStats("does-not-exist/repo")
  ).rejects.toThrow("repo not found: does-not-exist/repo");
});

test("fetchRepoStats throws on 403 rate limit", async () => {
  const { fetchRepoStats } = await import("../src/fetcher");

  await expect(
    fetchRepoStats("rate-limited/repo")
  ).rejects.toThrow("GitHub rate limit hit");
});

test("fetchRepoStats sends Authorization header when token provided", async () => {
  const { fetchRepoStats } = await import("../src/fetcher");
  await fetchRepoStats("mitosisdev/repocard", "my-token");

  expect(mockFetch).toHaveBeenCalledTimes(1);
  const [, opts] = mockFetch.mock.calls[0] as [string, RequestInit];
  const headers = opts?.headers as Record<string, string> | undefined;
  expect(headers?.["Authorization"]).toBe("Bearer my-token");
});
