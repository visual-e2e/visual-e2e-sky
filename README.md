# Visual E2E Sky

[Visual E2E](https://visual-e2e.github.io) 官方网站：介绍产品能力，并提供 macOS / Windows 桌面客户端下载。

线上地址：https://visual-e2e.github.io

## 产品简介

Visual E2E 是面向 JSON 驱动场景的可视化 E2E 测试工作台。通过桌面客户端，你可以：

- 编排与管理测试场景
- 本地发起运行并查看结果
- 浏览 HTML 报告、截图与运行录屏
- 使用宏、规则与产品画像减少重复配置
- 自动检测、安装或手动选择 Chrome / Chromium
- 使用内置工具及本地自定义工具辅助测试

本仓库维护官网页面；客户端安装包来自产品仓库 [visual-e2e-test](https://github.com/visual-e2e/visual-e2e-test) 的发布版本。

## 获取客户端

访问官网下载区，选择对应平台安装包：

| 平台 | 说明 |
|------|------|
| macOS Apple Silicon | arm64 安装包 |
| macOS Intel | x64 安装包 |
| Windows | 安装程序 |

系统要求见官网「运行环境」章节。安装后按站点引导：配置浏览器 → 创建项目 → 编排场景 →
运行并查看报告。

## 本地预览

如需在本地查看或修改官网：

```bash
npm install
npm run dev
```

浏览器打开终端提示的本地地址即可。

| 命令 | 用途 |
|------|------|
| `npm run dev` | 本地预览与开发 |
| `npm run build:manifests` | 仅更新 `public/downloads.json` 与 `public/tools.json` |
| `npm run build:site` | 拉取最新下载信息并构建站点 |
| `npm run sync:pages` | 将构建结果发布到官网 |
| `npm run release` | 准备新版本分支 |
| `npm run pub` | 发布本站版本并更新官网 |

## 发布官网

默认分支为 `master`。

```bash
npm run release          # 创建版本分支
# 合并回 master 后
npm run pub              # 发布版本并更新 https://visual-e2e.github.io
```

## 客户端发新版后

`visual-e2e-test` 发布新 Release（含安装包）后，在本仓库 `master` 执行：

```bash
npm run build:manifests && npm run commit:generated && npm run build && npm run sync:pages
```

会先提交清单，再构建并更新官网，避免「已发布但清单提交失败」的不一致状态，无需 bump 本站版本。

## 相关仓库

| 仓库 | 说明 |
|------|------|
| [visual-e2e-test](https://github.com/visual-e2e/visual-e2e-test) | 桌面客户端 |
| [visual-e2e-sky](https://github.com/visual-e2e/visual-e2e-sky) | 官网源码（本仓库） |
| [visual-e2e.github.io](https://github.com/visual-e2e/visual-e2e.github.io) | 官网线上内容 |

## License

Private
