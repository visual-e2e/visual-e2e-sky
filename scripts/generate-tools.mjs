#!/usr/bin/env node
/**
 * Fetch each tool repo's latest GitHub Release and write public/tools.json.
 * Only tools with a `.vettool.zip` asset are included.
 *
 * Env:
 *   GH_TOKEN / GITHUB_TOKEN  optional (falls back to `gh auth token`)
 *   OUT_FILE                 default public/tools.json
 *
 * On GitHub API errors (rate limit, network, 5xx), exits non-zero and does
 * not overwrite the existing catalog.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TOOL_REPOS } from "./lib/tool-repos.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_FILE = process.env.OUT_FILE ?? join(ROOT, "public", "tools.json");

function resolveGhToken() {
  const fromEnv = (process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? "").trim();
  if (fromEnv) return fromEnv;
  try {
    return execFileSync("gh", ["auth", "token"], {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

const GH_TOKEN = resolveGhToken();
if (GH_TOKEN) {
  console.log("Using authenticated GitHub API requests");
} else {
  console.warn(
    "Warning: no GH_TOKEN / GITHUB_TOKEN / gh auth token — unauthenticated requests hit rate limits easily",
  );
}

async function githubFetch(path) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "visual-e2e-sky-generate-tools",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (GH_TOKEN) headers.Authorization = `Bearer ${GH_TOKEN}`;

  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status} ${path}: ${body}`);
  }
  return res.json();
}

function pickVettoolAsset(release, toolId) {
  const assets = release?.assets ?? [];
  const preferred = assets.find(
    (a) =>
      typeof a.name === "string" &&
      a.name.toLowerCase().endsWith(".vettool.zip") &&
      a.name.toLowerCase().includes(toolId),
  );
  const any = assets.find(
    (a) => typeof a.name === "string" && a.name.toLowerCase().endsWith(".vettool.zip"),
  );
  return preferred ?? any ?? null;
}

/** @returns {Promise<object|null>} catalog entry, or null to skip */
async function buildToolEntry(meta) {
  const base = {
    id: meta.id,
    name: meta.name,
    description: meta.description,
    icon: meta.icon,
    category: meta.category,
    repo: meta.repo,
    ports: { preferredProd: meta.preferredProd },
    engines: { host: meta.enginesHost },
    version: null,
    releasedAt: null,
    releaseUrl: `https://github.com/${meta.repo}/releases`,
    package: null,
  };

  const release = await githubFetch(`/repos/${meta.repo}/releases/latest`);
  if (!release) {
    console.warn(`  [${meta.id}] skip (no release yet)`);
    return null;
  }

  const tag = String(release.tag_name ?? "").replace(/^v/, "");
  const asset = pickVettoolAsset(release, meta.id);
  if (!asset) {
    console.warn(`  [${meta.id}] skip (no .vettool.zip on latest release)`);
    return null;
  }

  return {
    ...base,
    version: tag || null,
    releasedAt: release.published_at ?? null,
    releaseUrl: release.html_url ?? base.releaseUrl,
    package: {
      filename: asset.name,
      url: asset.browser_download_url,
      size: asset.size ?? 0,
    },
  };
}

const tools = [];
const errors = [];

for (const meta of TOOL_REPOS) {
  console.log(`Fetching ${meta.repo}…`);
  try {
    const entry = await buildToolEntry(meta);
    if (entry) tools.push(entry);
  } catch (err) {
    const cause =
      err instanceof Error && err.cause instanceof Error
        ? `: ${err.cause.message}`
        : "";
    const msg = err instanceof Error ? `${err.message}${cause}` : String(err);
    console.error(`  [${meta.id}] ${msg}`);
    errors.push(meta.id);
  }
}

if (errors.length > 0) {
  console.error(
    `\nAborting: GitHub API failed for ${errors.join(", ")}; left ${OUT_FILE} unchanged.`,
  );
  process.exit(1);
}

const catalog = {
  version: 1,
  updatedAt: new Date().toISOString(),
  catalogUrl: "tools.json",
  tools,
};

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, `${JSON.stringify(catalog, null, 2)}\n`, "utf-8");

console.log(`Wrote ${OUT_FILE}`);
console.log(`  tools: ${tools.length}`);
for (const t of tools) {
  console.log(`    [${t.id}] v${t.version ?? "?"} ${t.package.filename}`);
}
