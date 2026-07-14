#!/usr/bin/env node
/**
 * Fetch product repo GitHub Release assets and write public/downloads.json.
 *
 * Env:
 *   PRODUCT_REPO  owner/repo (default: visual-e2e/visual-e2e-test)
 *   VERSION       tag e.g. v1.0.0 (default: latest release)
 *   GH_TOKEN      optional, for private repos or higher rate limits
 *   OUT_FILE      output path (default: public/downloads.json)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCT_REPO = process.env.PRODUCT_REPO ?? "visual-e2e/visual-e2e-test";
const VERSION = process.env.VERSION?.trim() || "";
const OUT_FILE = process.env.OUT_FILE ?? join(ROOT, "public", "downloads.json");
const GH_TOKEN = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? "";

const ASSET_LABELS = {
  "mac-arm64": "macOS (Apple Silicon)",
  "mac-x64": "macOS (Intel)",
  win: "Windows",
};

function classifyAsset(name) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".exe")) return "win";
  if (lower.endsWith(".dmg")) {
    if (lower.includes("arm64") || lower.includes("-arm64")) return "mac-arm64";
    return "mac-x64";
  }
  return null;
}

async function githubFetch(path) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "visual-e2e-sky-generate-downloads",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (GH_TOKEN) headers.Authorization = `Bearer ${GH_TOKEN}`;

  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status} ${path}: ${body}`);
  }
  return res.json();
}

async function loadRelease() {
  if (VERSION) {
    return githubFetch(`/repos/${PRODUCT_REPO}/releases/tags/${encodeURIComponent(VERSION)}`);
  }
  return githubFetch(`/repos/${PRODUCT_REPO}/releases/latest`);
}

function buildManifest(release) {
  const tag = release.tag_name ?? "";
  const version = tag.replace(/^v/, "");
  const releaseUrl = release.html_url ?? `https://github.com/${PRODUCT_REPO}/releases`;

  const byId = new Map();
  for (const asset of release.assets ?? []) {
    const id = classifyAsset(asset.name);
    if (!id) continue;
    // Prefer first match per platform; skip duplicates.
    if (byId.has(id)) continue;
    byId.set(id, {
      id,
      label: ASSET_LABELS[id],
      filename: asset.name,
      url: asset.browser_download_url,
      size: asset.size ?? 0,
    });
  }

  const order = ["mac-arm64", "mac-x64", "win"];
  const assets = order.filter((id) => byId.has(id)).map((id) => byId.get(id));

  return {
    version,
    releasedAt: release.published_at ?? null,
    productRepo: PRODUCT_REPO,
    releaseUrl,
    assets,
  };
}

const release = await loadRelease();
const manifest = buildManifest(release);

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, `${JSON.stringify(manifest, null, 2)}\n`, "utf-8");

console.log(`Wrote ${OUT_FILE}`);
console.log(`  version: ${manifest.version}`);
console.log(`  assets: ${manifest.assets.length}`);
for (const a of manifest.assets) {
  console.log(`    [${a.id}] ${a.filename}`);
}
