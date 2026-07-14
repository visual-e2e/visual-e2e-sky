import { REQUIREMENTS } from "../constants";

export function Requirements() {
  return (
    <section className="section section--muted" id="requirements">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">系统要求</h2>
        </div>
        <dl className="requirements">
          {REQUIREMENTS.map((item) => (
            <div key={item.platform} className="requirements__row">
              <dt>{item.platform}</dt>
              <dd>{item.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
