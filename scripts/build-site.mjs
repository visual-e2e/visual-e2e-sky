#!/usr/bin/env node
/**
 * 生成 downloads.json 并以根路径构建站点（VITE_BASE=/）。
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function run(cmd, args, env = {}) {
  const r = spawnSync(cmd, args, {
    cwd: ROOT,
    encoding: "utf-8",
    stdio: "inherit",
    env: { ...process.env, VITE_BASE: "/", ...env },
  });
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

run("node", ["scripts/generate-downloads.mjs"]);
run("npm", ["run", "build"], { VITE_BASE: "/" });
