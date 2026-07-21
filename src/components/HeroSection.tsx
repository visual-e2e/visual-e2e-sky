import { GITHUB_REPO_URL } from "../constants";

export function HeroSection() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">桌面客户端 · Playwright · JSON 步骤流</p>
          <h1 className="hero__title">可视化 E2E 自动化测试工作台</h1>
          <p className="hero__desc">
            用 JSON 描述测试步骤，在可视化界面编排场景、运行测试、查看带截图与录屏的 HTML
            报告。支持浏览器环境配置、测试工具箱、宏与规则模板、产品画像导入及多项目管理。
          </p>
          <div className="hero__actions">
            <a href="#download" className="btn btn--primary">
              下载桌面客户端
            </a>
            <a href={GITHUB_REPO_URL} className="btn btn--ghost" target="_blank" rel="noreferrer">
              查看源码
            </a>
          </div>
        </div>
        <div className="hero__panel" aria-hidden>
          <div className="hero__panel-bar">
            <span />
            <span />
            <span />
          </div>
          <pre className="hero__code">{`{
  "type": "click",
  "selector": "button:has-text(\\"运行\\")",
  "desc": "点击运行测试"
}`}</pre>
        </div>
      </div>
    </section>
  );
}
