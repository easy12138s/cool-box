# Cool Box

基于 Vite + Vue 3 的静态项目展示网站。

## 特性

- 暗黑模式（light/dark/auto）
- 国际化（中英文）
- 项目搜索（minisearch）
- 项目详情 Markdown 渲染（marked）

## 快速开始

```bash
pnpm install

pnpm dev

pnpm build

pnpm preview
```

## 添加新项目

在 `content/projects/` 下创建目录：

```
content/projects/my-project/
├── meta.yml      # 项目元数据
├── index.zh.md   # 中文内容
└── index.en.md  # 英文内容（可选）
```

### meta.yml 示例

```yaml
slug: my-project
title:
  zh: 我的项目
  en: My Project
description:
  zh: 项目描述
  en: Project description

tags: [Vue, TypeScript]
status: active

links:
  github: https://github.com/...
  demo: https://...

createdAt: 2024-01-15
order: 1
```

## 部署

### Docker（本地/自建服务器）

```bash
docker compose up -d --build
```

访问 `http://localhost:3000`

### GitHub Actions + 阿里云 ACR + 服务器

仓库内置工作流：`.github/workflows/ci-cd.yml`（构建镜像 → 推送到 ACR → SSH 到服务器拉取并重启容器）。

### GitHub Pages

本项目为静态站点，可部署到 GitHub Pages（已适配 Hash 路由与相对 base）。若你的 GitHub Pages 已用于个人域名根站点（例如 Hexo），建议使用 Project Pages（`https://<user>.github.io/<repo>/`）避免冲突。

推荐使用 `gh-pages` 分支发布：仓库内置工作流 `.github/workflows/gh-pages.yml`，会将 `dist/` 推送到 `gh-pages` 分支。GitHub 设置里将 Pages Source 选择 “Deploy from a branch”，并选择 `gh-pages` / `(root)`，等待 Actions 跑完后即可访问 `https://<user>.github.io/<repo>/`。

## 配置

修改 `config/site.yml` 配置网站信息：

```yaml
author:
  name: Your Name
  avatar: /images/avatar.png
  bio:
    zh: 中文介绍
    en: English bio

social:
  github: https://github.com/username
  blog: https://blog.example.com

site:
  title: Cool Box
  description:
    zh: 项目展示空间
    en: Project Showcase
```

## 技术栈

- Vue 3 + TypeScript
- Vite
- Vue Router
- Pinia
- UnoCSS
- marked
- minisearch

