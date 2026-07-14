import { FEATURES } from "../constants";

export function FeatureGrid() {
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">核心能力</h2>
          <p className="section__desc">覆盖从场景编写到报告查看的完整 E2E 工作流。</p>
        </div>
        <div className="feature-grid">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="feature-card">
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__desc">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
