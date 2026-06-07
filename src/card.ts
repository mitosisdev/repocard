export interface RepoData {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
}

// Language color map — common languages
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

export function generateCard(repo: RepoData): string {
  const langColor = LANG_COLORS[repo.language] ?? "#8b949e";
  const starsStr = formatNumber(repo.stars);
  const forksStr = formatNumber(repo.forks);

  // Split name into owner/repo for display
  const nameParts = repo.name.split("/");
  const ownerPart = nameParts.length > 1 ? nameParts[0] + "/" : "";
  const repoPart = nameParts.length > 1 ? nameParts[1] : repo.name;

  const desc = truncate(repo.description || "No description", 70);

  // Embedded font stack — system fonts only, no external URLs
  const fontFamily = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="150" viewBox="0 0 400 150" role="img" aria-label="${escapeXml(repo.name)} GitHub stats card">
  <title>${escapeXml(repo.name)}</title>
  <style>
    .bg { fill: #0d1117; }
    .border { fill: none; stroke: #30363d; stroke-width: 1; }
    .owner { font: 400 13px ${fontFamily}; fill: #8b949e; }
    .reponame { font: 700 16px ${fontFamily}; fill: #58a6ff; }
    .desc { font: 400 12px ${fontFamily}; fill: #8b949e; }
    .stat-label { font: 400 12px ${fontFamily}; fill: #8b949e; }
    .stat-value { font: 600 12px ${fontFamily}; fill: #c9d1d9; }
    .lang-dot { }
    .lang-label { font: 400 12px ${fontFamily}; fill: #c9d1d9; }
  </style>

  <!-- Background -->
  <rect class="bg" width="400" height="150" rx="6" ry="6"/>
  <rect class="border" width="399" height="149" x="0.5" y="0.5" rx="6" ry="6"/>

  <!-- Book/repo icon -->
  <g transform="translate(16, 18)" fill="#58a6ff">
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 1 1 0-1.5H12v-2h-8a1 1 0 0 0-.717 1.7.75.75 0 0 1-1.051 1.069A2.5 2.5 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.709A2.489 2.489 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/>
  </g>

  <!-- Repo name -->
  <text x="38" y="29">
    <tspan class="owner">${escapeXml(ownerPart)}</tspan><tspan class="reponame">${escapeXml(repoPart)}</tspan>
  </text>

  <!-- Description -->
  <text x="16" y="58" class="desc">${escapeXml(desc)}</text>

  <!-- Divider -->
  <line x1="16" y1="72" x2="384" y2="72" stroke="#21262d" stroke-width="1"/>

  <!-- Stars -->
  <g transform="translate(16, 88)">
    <svg width="14" height="14" viewBox="0 0 16 16" fill="#e3b341">
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.873 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
    </svg>
    <text x="20" y="11" class="stat-value">${escapeXml(starsStr)}</text>
    <text x="20" y="25" class="stat-label">stars</text>
  </g>

  <!-- Forks -->
  <g transform="translate(100, 88)">
    <svg width="14" height="14" viewBox="0 0 16 16" fill="#8b949e">
      <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
    </svg>
    <text x="20" y="11" class="stat-value">${escapeXml(forksStr)}</text>
    <text x="20" y="25" class="stat-label">forks</text>
  </g>

  <!-- Language -->
  <g transform="translate(184, 88)">
    <circle cx="5" cy="5" r="5" fill="${escapeXml(langColor)}"/>
    <text x="16" y="10" class="lang-label">${escapeXml(repo.language || "Unknown")}</text>
  </g>

  <!-- Footer watermark -->
  <text x="384" y="140" class="stat-label" text-anchor="end" font-size="10" fill="#30363d">repocard</text>
</svg>`;
}
