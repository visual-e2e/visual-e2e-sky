import { useEffect, useState } from "react";
import type { ToolCatalogEntry, ToolsCatalog } from "../types/tools-catalog";
import { formatBytes } from "../utils/format";

const CATALOG_URL = `${import.meta.env.BASE_URL}tools.json`;

export function ToolsStoreSection() {
  const [catalog, setCatalog] = useState<ToolsCatalog | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(CATALOG_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ToolsCatalog>;
      })
      .then((data) => {
        if (!cancelled) setCatalog(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "加载失败");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tools = catalog?.tools ?? [];

  return (
    <section className="section section--muted" id="tools-store">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">应用市场</h2>
          <p className="section__desc">
            为 Visual E2E Test 提供可安装的扩展工具。在此浏览与下载，在客户端一键安装。
            {catalog?.updatedAt ? (
              <>
                {" "}
                更新于 {new Date(catalog.updatedAt).toLocaleString("zh-CN")}。
              </>
            ) : null}
          </p>
        </div>

        {error ? (
          <p className="download-alert download-alert--warn">
            暂时无法加载应用市场，请稍后重试。
          </p>
        ) : null}

        {tools.length === 0 && !error ? (
          <div className="download-empty">
            <p>暂无上架工具，敬请期待。</p>
          </div>
        ) : (
          <div className="tools-store-grid">
            {tools.map((tool) => (
              <ToolStoreCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        <p className="download-note">
          安装在桌面客户端的「应用市场」中完成；本页提供工具介绍与安装包下载。
        </p>
      </div>
    </section>
  );
}

function ToolStoreCard({ tool }: { tool: ToolCatalogEntry }) {
  const version = tool.version ? `v${tool.version.replace(/^v/, "")}` : "即将上架";
  const pkg = tool.package;

  return (
    <article className="tools-store-card">
      <div className="tools-store-card__head">
        <h3 className="tools-store-card__title">{tool.name}</h3>
        <span className="tools-store-card__ver">{version}</span>
      </div>
      <p className="tools-store-card__desc">{tool.description || "—"}</p>
      {pkg?.size ? (
        <div className="tools-store-card__meta">
          <span>{formatBytes(pkg.size)}</span>
        </div>
      ) : null}
      <div className="tools-store-card__actions">
        {pkg?.url ? (
          <a className="btn btn--primary btn--sm" href={pkg.url} download={pkg.filename}>
            下载
          </a>
        ) : (
          <span className="tools-store-card__muted">即将上架</span>
        )}
        <a
          className="btn btn--ghost btn--sm"
          href={tool.releaseUrl}
          target="_blank"
          rel="noreferrer"
        >
          更新日志
        </a>
      </div>
    </article>
  );
}
