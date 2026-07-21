import { STEPS } from "../constants";

export function HowItWorks() {
  return (
    <section className="section section--muted" id="how-it-works">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">使用流程</h2>
          <p className="section__desc">
            安装客户端并完成浏览器配置后，即可在本地编排和运行测试。
          </p>
        </div>
        <ol className="steps">
          {STEPS.map((item) => (
            <li key={item.step} className="steps__item">
              <span className="steps__num">{item.step}</span>
              <div>
                <h3 className="steps__title">{item.title}</h3>
                <p className="steps__desc">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="arch-diagram">
          <span>Electron 客户端</span>
          <span className="arch-diagram__arrow">→</span>
          <span>Node Sidecar</span>
          <span className="arch-diagram__arrow">→</span>
          <span>Playwright (Chrome / Chromium)</span>
          <span className="arch-diagram__arrow">→</span>
          <span>HTML 报告</span>
        </div>
      </div>
    </section>
  );
}
