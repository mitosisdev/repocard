import type { RepoStats } from "./types";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "…";
}

export function renderCard(stats: RepoStats): string {
  const { name, description, stars, forks, watchers, language } = stats;

  const safeDesc = escapeXml(truncate(description, 50));
  const safeName = escapeXml(name);

  // Stats row: 4 items evenly spaced across width 400 with margin 20 each side
  // usable width = 360, 4 items, spacing = 90
  const statItems = [
    { icon: "⭐", label: String(stars) },
    { icon: "🍴", label: String(forks) },
    { icon: "👁", label: String(watchers) },
    { icon: "📝", label: language || "—" },
  ];

  const startX = 20;
  const spacing = 90;

  const statElements = statItems
    .map((item, i) => {
      const x = startX + i * spacing;
      return `    <text x="${x}" y="110" font-family="sans-serif" font-size="12" fill="#c9d1d9">${escapeXml(item.icon)} ${escapeXml(item.label)}</text>`;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="160" role="img" aria-label="${safeName}">
  <!-- Background -->
  <rect width="400" height="160" rx="10" ry="10" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
  <!-- Repo name -->
  <text x="20" y="35" font-family="Courier New, monospace" font-size="16" font-weight="bold" fill="#e6edf3">${safeName}</text>
  <!-- Description -->
  <text x="20" y="55" font-family="sans-serif" font-size="12" fill="#8b949e">${safeDesc}</text>
  <!-- Stats row -->
${statElements}
  <!-- Accent line -->
  <line x1="0" y1="155" x2="400" y2="155" stroke="#1f6feb" stroke-width="2"/>
</svg>`;
}
