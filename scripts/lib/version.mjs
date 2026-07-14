import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const PKG_PATH = join(REPO_ROOT, "package.json");
const LOCK_PATH = join(REPO_ROOT, "package-lock.json");

export function readVersion() {
  const pkg = JSON.parse(readFileSync(PKG_PATH, "utf-8"));
  if (!pkg.version) throw new Error("package.json 中未找到 version");
  return pkg.version;
}

export function writeVersion(version) {
  const pkg = JSON.parse(readFileSync(PKG_PATH, "utf-8"));
  pkg.version = version;
  writeFileSync(PKG_PATH, `${JSON.stringify(pkg, null, 2)}\n`, "utf-8");

  const lock = JSON.parse(readFileSync(LOCK_PATH, "utf-8"));
  lock.version = version;
  if (lock.packages?.[""]) lock.packages[""].version = version;
  writeFileSync(LOCK_PATH, `${JSON.stringify(lock, null, 2)}\n`, "utf-8");
}
