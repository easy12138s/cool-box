# Cool Box 开发文档

## 项目概述

基于 Vite + Vue 3 的静态项目展示网站，内容来自 `content/projects`，通过 Markdown 渲染生成项目详情页。

---

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue 3 | ^3.4.x |
| 构建 | Vite | ^5.x |
| 路由 | vue-router | ^4.x |
| 状态 | Pinia | ^2.x |
| 样式 | UnoCSS | ^0.58.x |
| 工具 | @vueuse/core | ^10.x |
| 搜索 | minisearch | ^6.x |
| Markdown | marked | ^12.x |
| 类型 | TypeScript | ^5.x |

---

## 目录结构

```
cool-box/
├── config/
│   └── site.yml              # 全局配置
├── content/
│   └── projects/             # 项目内容
│       ├── demo-project/
│       │   ├── meta.yml     # 项目元数据
│       │   ├── index.zh.md  # 中文内容
│       │   └── index.en.md  # 英文内容
│       └── vue-dashboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.vue               # 根组件
│   ├── main.ts               # 入口文件
│   ├── router/
│   │   └── index.ts          # 路由配置
│   ├── stores/
│   │   ├── projects.ts        # 项目状态
│   │   └── site.ts           # 站点状态
│   ├── views/
│   │   ├── Home.vue          # 主页
│   │   ├── Projects.vue      # 项目列表
│   │   ├── ProjectDetail.vue # 项目详情
│   │   └── Links.vue         # 外部链接
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.vue    # 导航栏
│   │   │   ├── Footer.vue    # 页脚
│   │   │   └── ThemeToggle.vue # 主题切换
│   │   ├── project/
│   │   │   ├── ProjectCard.vue    # 项目卡片
│   │   │   ├── ProjectFilter.vue  # 标签筛选
│   │   │   └── ProjectLinks.vue   # 项目链接
│   │   └── effects/
│   │       ├── ScrollReveal.vue    # 滚动揭示
│   │       └── FadeIn.vue          # 淡入动画
│   ├── composables/
│   │   ├── useProjects.ts    # 项目加载
│   │   └── useSearch.ts     # 搜索功能
│   ├── types/
│   │   └── index.ts          # 类型定义
│   └── styles/
│       └── global.css        # 全局样式
├── index.html
├── vite.config.ts
├── uno.config.ts
├── package.json
├── Dockerfile               # Docker 构建文件
├── nginx.conf              # Nginx 配置
├── docker-compose.yml      # Docker Compose
├── .github/
│   └── workflows/
│       └── ci-cd.yml       # GitHub Actions
└── .dockerignore
```

---

## 快速开始

```bash
pnpm install

pnpm dev

pnpm build

pnpm preview
```

---

## 页面路由

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | Home.vue | 主页 - 个人介绍 + 精选项目 |
| `/projects` | Projects.vue | 项目列表 - 支持筛选搜索 |
| `/projects/:slug` | ProjectDetail.vue | 项目详情 - Markdown 渲染 |
| `/links` | Links.vue | 外部链接聚合 |

---

## 核心功能

### 项目管理

**添加新项目：**

```bash
mkdir content/projects/my-project
```

在目录中创建：
- `meta.yml` - 项目元数据
- `index.zh.md` - 中文内容
- `index.en.md` - 英文内容（可选）

**meta.yml 示例：**

```yaml
slug: my-project
title:
  zh: 我的项目
  en: My Project
description:
  zh: 项目描述
  en: Project description

thumbnail: ./assets/cover.png
tags: [Vue, TypeScript]
status: active

links:
  github: https://github.com/...
  demo: https://...

createdAt: 2024-01-15
hidden: false
order: 1
```

---

## 配置说明

### site.yml

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
  twitter: https://twitter.com/username
  email: mailto:your@email.com

site:
  title: Cool Box
  description:
    zh: 项目展示空间
    en: Project Showcase
```

---

## 部署

### 构建

```bash
pnpm build
```

输出目录：`dist/`

---

### Docker 部署

**构建并运行：**

```bash
docker build -t cool-box .

docker run -d -p 3000:80 cool-box
```

**使用 Docker Compose：**

```bash
docker-compose up -d

docker-compose logs -f

docker-compose down
```

访问 `http://localhost:3000`
