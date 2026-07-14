import { GITHUB_RELEASES_URL, GITHUB_REPO_URL, SITE_REPO } from "../constants";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__copy">© {year} Visual E2E Test</p>
        <nav className="site-footer__links" aria-label="页脚链接">
          <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer">
            产品仓库
          </a>
          <a href={GITHUB_RELEASES_URL} target="_blank" rel="noreferrer">
            发布版本
          </a>
          <a href={`https://github.com/${SITE_REPO}`} target="_blank" rel="noreferrer">
            官网仓库
          </a>
        </nav>
      </div>
    </footer>
  );
}
