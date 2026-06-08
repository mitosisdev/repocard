export interface BadgeStats {
  name: string;
  stars: number;
  language: string | null;
}

// Language color map — common languages (mirrors card.ts)
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Ruby: "#701516",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  PHP: "#4F5D95",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Nix: "#7e7eff",
  Lua: "#000080",
  Haskell: "#5e5086",
  Elixir: "#6e4a7e",
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + "…";
}

/**
 * Generate a compact horizontal badge (280x80 px) for inline README embedding.
 * Layout: [repo icon] [repo-name]  |  star  [stars]  |  lang-dot [language]
 * Same dark theme as the full stat card.
 */
export function generateBadge(stats: BadgeStats): string {
  const language = stats.language ?? "";
  const langColor = LANG_COLORS[language] ?? "#8b949e";
  const starsStr = formatNumber(stats.stars);

  // Show only the repo portion if an owner/repo string was passed.
  const nameParts = stats.name.split("/");
  const displayName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : stats.name;
  const repoName = truncate(displayName, 22);

  const langLabel = language || "Unknown";

  const fontFamily = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="80" viewBox="0 0 280 80" role="img" aria-label="${escapeXml(stats.name)} GitHub badge">
  <title>${escapeXml(stats.name)}</title>
  <style>
    .bg { fill: #0d1117; }
    .border { fill: none; stroke: #30363d; stroke-width: 1; }
    .reponame { font: 700 14px ${fontFamily}; fill: #58a6ff; }
    .stat-value { font: 600 12px ${fontFamily}; fill: #c9d1d9; }
    .lang-label { font: 400 12px ${fontFamily}; fill: #c9d1d9; }
  </style>

  <!-- Background -->
  <rect class="bg" width="280" height="80" rx="6" ry="6"/>
  <rect class="border" width="279" height="79" x="0.5" y="0.5" rx="6" ry="6"/>

  <!-- Book/repo icon -->
  <g transform="translate(14, 14)" fill="#58a6ff">
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 1 1 0-1.5H12v-2h-8a1 1 0 0 0-.717 1.7.75.75 0 0 1-1.051 1.069A2.5 2.5 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.709A2.489 2.489 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/>
  </g>

  <!-- Repo name -->
  <text x="36" y="26" class="reponame">${escapeXml(repoName)}</text>

  <!-- Divider -->
  <line x1="14" y1="40" x2="266" y2="40" stroke="#21262d" stroke-width="1"/>

  <!-- Stars -->
  <g transform="translate(14, 52)">
    <svg width="14" height="14" viewBox="0 0 16 16" fill="#e3b341">
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.873 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
    </svg>
    <text x="20" y="12" class="stat-value">${escapeXml(starsStr)}</text>
  </g>

  <!-- Language -->
  <g transform="translate(120, 52)">
    <circle cx="5" cy="7" r="5" fill="${escapeXml(langColor)}"/>
    <text x="16" y="12" class="lang-label">${escapeXml(langLabel)}</text>
  </g>
</svg>`;
}
