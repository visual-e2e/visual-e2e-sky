export const PRODUCT_REPO = "visual-e2e/visual-e2e-test";
export const GITHUB_REPO_URL = `https://github.com/${PRODUCT_REPO}`;
export const GITHUB_RELEASES_URL = `${GITHUB_REPO_URL}/releases`;

export const SITE_REPO = "visual-e2e/visual-e2e-sky";
export const PAGES_REPO = "visual-e2e/visual-e2e.github.io";
export const SITE_URL = "https://visual-e2e.github.io";

export const FEATURES = [
  {
    title: "场景管理",
    description: "JSON 步骤流编辑，支持流程图与 verify 分支跳转。",
  },
  {
    title: "运行中心",
    description: "发起测试、查看运行状态，打包下载报告与产物。",
  },
  {
    title: "宏与规则",
    description: "可复用步骤组合与场景继承模板，减少重复编排。",
  },
  {
    title: "产品画像",
    description: "从 Markdown 产品画像导入并转换为测试场景。",
  },
  {
    title: "校验中心",
    description: "校验场景与配置，在运行前发现结构问题。",
  },
  {
    title: "测试报告",
    description: "HTML 报告、截图预览与 WebM 整次运行录屏。",
  },
  {
    title: "多项目管理",
    description: "按 projects/{id} 隔离业务项目与运行数据。",
  },
  {
    title: "桌面客户端",
    description: "Electron 本地运行，用户数据目录独立持久化。",
  },
] as const;

export const STEPS = [
  { step: "1", title: "安装客户端", description: "下载并安装 macOS 或 Windows 桌面版。" },
  { step: "2", title: "创建项目", description: "从模版新建或导入已有测试项目。" },
  { step: "3", title: "编排场景", description: "编辑 JSON 步骤流，或使用产品画像导入。" },
  { step: "4", title: "运行与报告", description: "在运行中心执行测试，查看 HTML 报告与录屏。" },
] as const;

export const REQUIREMENTS = [
  { platform: "macOS", detail: "11+，Apple Silicon (arm64) 或 Intel (x64)" },
  { platform: "Windows", detail: "10 或更高版本 (x64)" },
  { platform: "浏览器", detail: "需安装 Google Chrome（客户端默认 channel: chrome）" },
  { platform: "运行时", detail: "安装包已内置 Node sidecar，无需单独安装 Node" },
] as const;
