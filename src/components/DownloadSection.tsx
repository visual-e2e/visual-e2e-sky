import { useEffect, useState } from "react";
import type { DownloadAsset, DownloadsManifest } from "../types/downloads";
import { GITHUB_RELEASES_URL } from "../constants";
import { detectPreferredAssetId, formatBytes } from "../utils/format";

const MANIFEST_URL = `${import.meta.env.BASE_URL}downloads.json`;

const ASSET_ORDER: DownloadAsset["id"][] = ["mac-arm64", "mac-x64", "win"];

function sortAssets(assets: DownloadAsset[]): DownloadAsset[] {
  return [...assets].sort(
    (a, b) => ASSET_ORDER.indexOf(a.id) - ASSET_ORDER.indexOf(b.id),
  );
}

export function DownloadSection() {
  const [manifest, setManifest] = useState<DownloadsManifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const preferredId = detectPreferredAssetId();

  useEffect(() => {
    let cancelled = false;
    fetch(MANIFEST_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<DownloadsManifest>;
      })
      .then((data) => {
        if (!cancelled) setManifest(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "加载失败");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const assets = manifest ? sortAssets(manifest.assets) : [];
  const releaseUrl = manifest?.releaseUrl ?? GITHUB_RELEASES_URL;

  return (
    <section className="section" id="download">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">下载客户端</h2>
          <p className="section__desc">
            {manifest?.version ? (
              <>
                当前版本 <strong>v{manifest.version.replace(/^v/, "")}</strong>
                {manifest.releasedAt ? (
                  <> · 发布于 {new Date(manifest.releasedAt).toLocaleDateString("zh-CN")}</>
                ) : null}
              </>
            ) : (
              "安装包由 GitHub Release 分发，下方按钮将在发布后自动更新。"
            )}
          </p>
        </div>

        {error ? (
          <p className="download-alert download-alert--warn">
            无法加载下载清单（{error}）。请前往{" "}
            <a href={GITHUB_RELEASES_URL} target="_blank" rel="noreferrer">
              GitHub Releases
            </a>{" "}
            手动下载。
          </p>
        ) : null}

        {assets.length === 0 && !error ? (
          <div className="download-empty">
            <p>暂无已发布的安装包。</p>
            <a href={releaseUrl} className="btn btn--primary" target="_blank" rel="noreferrer">
              查看 GitHub Releases
            </a>
          </div>
        ) : (
          <div className="download-grid">
            {assets.map((asset) => {
              const recommended = preferredId === asset.id;
              return (
                <a
                  key={asset.id}
                  href={asset.url}
                  className={`download-card${recommended ? " download-card--recommended" : ""}`}
                  download={asset.filename}
                >
                  {recommended ? <span className="download-card__badge">推荐</span> : null}
                  <span className="download-card__label">{asset.label}</span>
                  <span className="download-card__file">{asset.filename}</span>
                  <span className="download-card__size">{formatBytes(asset.size)}</span>
                </a>
              );
            })}
          </div>
        )}

        <p className="download-note">
          macOS：打开 .dmg 后将应用拖入「应用程序」。Windows：运行 .exe 安装程序。
          Chromium 不随安装包内置，可在客户端中按需安装或选择本机 Chrome / Chromium。
          所有版本见{" "}
          <a href={releaseUrl} target="_blank" rel="noreferrer">
            Releases 页面
          </a>
          。
        </p>

        <aside className="download-tip" aria-label="macOS 安装提示">
          <h3 className="download-tip__title">macOS 提示：「已损坏，无法打开」怎么办？</h3>
          <p className="download-tip__desc">
            系统可能给应用加上隔离标记。请先卸载/删除本机已有的 Visual E2E
            Test，再对新下载的应用执行以下命令。
          </p>
          <ol className="download-tip__steps">
            <li>
              打开「终端」，输入下面命令，
              <strong>末尾一定要留一个空格</strong>：
              <pre className="download-tip__code"><code>{"xattr -r -d com.apple.quarantine "}</code></pre>
            </li>
            <li>
              找到 <code>Visual E2E Test.app</code>，拖进终端窗口，让系统自动补全路径。完整命令类似：
              <pre className="download-tip__code"><code>{`xattr -r -d com.apple.quarantine /Users/你的用户名/Downloads/Visual\\ E2E\\ Test.app`}</code></pre>
            </li>
          </ol>
          <p className="download-tip__desc">回车执行后再打开应用即可。</p>
        </aside>
      </div>
    </section>
  );
}
