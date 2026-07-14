#!/usr/bin/env node
/**
 * 将 dist/ 同步到 visual-e2e.github.io 仓库（GitHub Pages 源）。
 *
 * 环境变量：
 *   PAGES_REPO          目标仓库 owner/repo（默认 visual-e2e/visual-e2e.github.io）
 *   PAGES_BRANCH        分支（默认 master）
 *   PAGES_REMOTE        完整 git remote URL（可选，覆盖默认 SSH/HTTPS）
 *   PAGES_DEPLOY_TOKEN  PAT，用于 HTTPS push（CI 或本地）
 *   DIST_DIR            构建产物目录（默认 dist）
 *   DEPLOY_VERSION      commit 信息中的版本（默认 package.json version）
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readVersion } from "./lib/version.mjs";
import { PAGES_BRANCH, PAGES_REPO, pagesRemoteUrl } from "./lib/repos.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST_DIR = process.env.DIST_DIR ?? join(ROOT, "dist");
const DEPLOY_VERSION = process.env.DEPLOY_VERSION ?? readVersion();
const REMOTE = pagesRemoteUrl();

function runGit(cwd, args, inherit = false) {
  return spawnSync("git", args, {
    cwd,
    encoding: "utf-8",
    stdio: inherit ? "inherit" : "pipe",
  });
}

function gitOrThrow(cwd, args, inherit = false) {
  const r = runGit(cwd, args, inherit);
  if (r.status !== 0) {
    throw new Error((r.stderr || r.stdout || "git failed").trim());
  }
  return (r.stdout || "").trim();
}

function clearWorktree(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === ".git") continue;
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

function prepareWorktree(workDir) {
  const clone = runGit(process.cwd(), [
    "clone",
    "--depth",
    "1",
    "-b",
    PAGES_BRANCH,
    REMOTE,
    workDir,
  ]);

  if (clone.status === 0) {
    clearWorktree(workDir);
    return;
  }

  console.log(`克隆 ${PAGES_REPO} 失败（可能为空仓库），初始化新工作区…`);
  rmSync(workDir, { recursive: true, force: true });
  mkdirSync(workDir);
  gitOrThrow(workDir, ["init"]);
  gitOrThrow(workDir, ["remote", "add", "origin", REMOTE]);
  gitOrThrow(workDir, ["checkout", "-b", PAGES_BRANCH]);
}

if (!existsSync(DIST_DIR)) {
  console.error(`缺少构建产物 ${DIST_DIR}，请先 npm run build:site`);
  process.exit(1);
}

const workDir = mkdtempSync(join(tmpdir(), "ve2e-pages-"));

try {
  console.log(`同步 ${DIST_DIR} → ${PAGES_REPO} (${PAGES_BRANCH})`);
  prepareWorktree(workDir);

  cpSync(DIST_DIR, workDir, { recursive: true });

  gitOrThrow(workDir, ["add", "-A"]);
  const status = gitOrThrow(workDir, ["status", "--porcelain"]);
  if (!status) {
    console.log("站点无变更，跳过推送");
    process.exit(0);
  }

  const message = `deploy: site v${DEPLOY_VERSION}`;
  gitOrThrow(workDir, ["commit", "-m", message]);

  const push = runGit(workDir, ["push", "-u", "origin", PAGES_BRANCH], true);
  if (push.status !== 0) {
    throw new Error("推送到 Pages 仓库失败，请确认 SSH/PAT 权限");
  }

  console.log(`\n已同步到 ${PAGES_REPO}，站点: https://visual-e2e.github.io`);
} catch (err) {
  console.error(err.message);
  process.exit(1);
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
