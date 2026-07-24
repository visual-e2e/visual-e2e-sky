import { GITHUB_REPO_URL } from "../constants";

const NAV = [
  { href: "#features", label: "功能" },
  { href: "#how-it-works", label: "使用流程" },
  { href: "#download", label: "下载" },
  { href: "#tools-store", label: "应用市场" },
  { href: "#requirements", label: "系统要求" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="#top">
          <img src={`${import.meta.env.BASE_URL}favicon-32x32.png`} alt="" width={28} height={28} />
          <span className="brand__text">
            <span className="brand__name">Visual E2E Test</span>
            <span className="brand__tagline">JSON-driven E2E Workbench</span>
          </span>
        </a>
        <nav className="site-nav" aria-label="主导航">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="site-nav__link">
              {item.label}
            </a>
          ))}
          <a href={GITHUB_REPO_URL} className="site-nav__link" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
        <a href="#download" className="btn btn--primary btn--sm site-header__cta">
          下载客户端
        </a>
      </div>
    </header>
  );
}
