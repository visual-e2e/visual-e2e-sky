import { DEV_RPC_METHODS, DEV_RPC_NOTIFIES } from "../constants";

export function DevCenterSection() {
  return (
    <section className="section" id="dev-center">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">开发中心</h2>
          <p className="section__desc">
            面向工具开发者的联调入口，覆盖本地开发流程与 Host RPC 契约。通信协议使用
            <code> channel: "vet-rpc" </code>，版本为 <code>RPC_PROTOCOL_VERSION = 1</code>。
          </p>
        </div>

        <div className="dev-center-card">
          <h3 className="dev-center-card__title">快速开始</h3>
          <ol className="dev-center-list">
            <li>使用 CLI 初始化工具项目：vet init tool。</li>
            <li>在客户端「应用中心」中选择本地目录，注入到「开发小工具」。</li>
            <li>在工具目录配置 E2E_ROOT 后执行 npm run dev，回到客户端打开卡片联调。</li>
          </ol>
        </div>

        <div className="dev-center-card">
          <h3 className="dev-center-card__title">Tool → Host RPC 列表</h3>
          <div className="dev-center-table-wrap">
            <table className="dev-center-table">
              <thead>
                <tr>
                  <th>method</th>
                  <th>capability</th>
                  <th>client API</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                {DEV_RPC_METHODS.map((item) => (
                  <tr key={item.method}>
                    <td>
                      <code>{item.method}</code>
                    </td>
                    <td>
                      <code>{item.capability}</code>
                    </td>
                    <td>
                      <code>{item.api}</code>
                    </td>
                    <td>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dev-center-card">
          <h3 className="dev-center-card__title">Host → Tool 通知</h3>
          <ul className="dev-center-list">
            {DEV_RPC_NOTIFIES.map((item) => (
              <li key={item.notify}>
                <code>{item.notify}</code>：{item.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="dev-center-card">
          <h3 className="dev-center-card__title">tool.json capabilities 示例</h3>
          <pre className="dev-center-code">
            {`{
  "capabilities": [
    "project.context",
    "project.list",
    "project.variables",
    "config.settings",
    "config.browserRuntime",
    "fs.pickFolder",
    "scenario.navigate",
    "cache.clear"
  ]
}`}
          </pre>
        </div>
      </div>
    </section>
  );
}
