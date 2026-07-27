/**
 * Platform tools listed in the official tools catalog (tools.json).
 * generate-tools.mjs merges this with each repo's latest GitHub Release.
 */
export const TOOL_REPOS = [
  {
    id: "image-rename",
    repo: "visual-e2e/visual-e2e-tool-image-rename",
    name: "图片批量重命名",
    description: "按规则批量重命名文件夹中的图片",
    icon: "picture",
    category: "file",
    preferredProd: 7201,
    enginesHost: ">=1.4.0",
    author: { name: "Dami" },
  },
  {
    id: "scenario-recorder",
    repo: "visual-e2e/visual-e2e-tool-scenario-recorder",
    name: "场景录制",
    description: "录制浏览器操作并生成场景 JSON",
    icon: "video",
    category: "test",
    preferredProd: 7202,
    enginesHost: ">=1.4.0",
    author: { name: "Dami" },
  },
  {
    id: "health-scan",
    repo: "visual-e2e/visual-e2e-tool-health-scan",
    name: "健康扫描",
    description: "扫描静态资源 404、接口 5xx、页面错乱与失效点击",
    icon: "tool",
    category: "test",
    preferredProd: 7203,
    enginesHost: ">=1.4.0",
    author: { name: "Dami" },
  },
];
