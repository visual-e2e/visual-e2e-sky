export const PAGES_REPO = process.env.PAGES_REPO ?? "visual-e2e/visual-e2e.github.io";
export const PAGES_BRANCH = process.env.PAGES_BRANCH ?? "master";
export const SITE_URL = "https://visual-e2e.github.io";

export function pagesRemoteUrl(repo = PAGES_REPO) {
  if (process.env.PAGES_REMOTE) return process.env.PAGES_REMOTE;
  const token = process.env.PAGES_DEPLOY_TOKEN ?? process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
  if (token) return `https://x-access-token:${token}@github.com/${repo}.git`;
  return `git@github.com:${repo}.git`;
}
