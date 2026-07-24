#!/usr/bin/env node
/**
 * 将 build:site 生成的 public 清单提交并推送到当前分支。
 * 仅处理 public/downloads.json、public/tools.json；无变更则跳过。
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFESTS = ["public/downloads.json", "public/tools.json"];

function runGit(args, inherit = false) {
  return spawnSync("git", args, {
    cwd: ROOT,
    encoding: "utf-8",
    stdio: inherit ? "inherit" : "pipe",
  });
}

function gitOrThrow(args, inherit = false) {
  const r = runGit(args, inherit);
  if (r.status !== 0) {
    throw new Error((r.stderr || r.stdout || `git ${args.join(" ")} failed`).trim());
  }
  return (r.stdout || "").trim();
}

function dirtyManifests() {
  const status = gitOrThrow(["status", "--porcelain", "--", ...MANIFESTS]);
  if (!status) return [];
  return status
    .split("\n")
    .map((line) => line.slice(3).trim())
    .filter(Boolean);
}

try {
  const changed = dirtyManifests();
  if (changed.length === 0) {
    console.log("清单无变更，跳过提交");
    process.exit(0);
  }

  const branch = gitOrThrow(["rev-parse", "--abbrev-ref", "HEAD"]);
  console.log(`提交清单到 ${branch}: ${changed.join(", ")}`);

  gitOrThrow(["add", "--", ...changed]);
  gitOrThrow(["commit", "-m", "chore(site): 同步 downloads/tools 清单"]);

  const push = runGit(["push", "origin", branch], true);
  if (push.status !== 0) {
    throw new Error(`推送到 origin/${branch} 失败`);
  }

  console.log(`已推送清单到 origin/${branch}`);
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
