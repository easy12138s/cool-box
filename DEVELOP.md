# Cool Box 开发文档

> 最后更新: 2024-06-21

## 项目状态

| 模块 | 状态 | 说明 |
|------|------|------|
| 基础框架 | ✅ 完成 | Vite + Vue 3 + TypeScript |
| 动态内容加载 | ✅ 完成 | 自动扫描 content/projects 目录 |
| Markdown 渲染 | ✅ 完成 | 使用 marked 库 |
| 搜索功能 | ✅ 完成 | minisearch 全文搜索 |
| 暗黑模式 | ✅ 完成 | light/dark/auto 三种模式 |
| 页面动画 | ✅ 完成 | 过渡动画 + 揭示组件 |
| 项目展示组件 | ✅ 完成 | Card, Filter, Links 等 |
| 国际化 | ✅ 完成 | 中英文支持 |

---

## 项目概述

基于 Vite + Vue 3 的静态项目展示网站，支持：
- 灵活的项目展示（Markdown / Vue 组件）
- 暗黑模式、国际化
- 响应式布局、动画效果
- 便捷的内容管理和扩展

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
└── package.json
```

---

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

---

## 开发规范

### 组件规范

- 使用 `<script setup lang="ts">` 语法
- 组件名使用 PascalCase
- Props 使用 TypeScript 类型定义

### 样式规范

- 使用 UnoCSS 原子化类
- 暗色模式支持：通过 `dark:` 前缀
- 颜色变量：在 `uno.config.ts` 中定义

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

### 1. 项目管理

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

### 2. 国际化

使用 `useSiteStore` 的 `locale` 状态：

```typescript
const siteStore = useSiteStore()
siteStore.locale // 'zh' | 'en'

// 切换语言
siteStore.setLocale('en')
```

### 3. 暗黑模式

```typescript
// 切换主题
siteStore.toggleTheme() // light -> dark -> auto

// 或直接设置
siteStore.setTheme('dark')
```

### 4. 搜索功能

```typescript
const { initSearch, search } = useSearch()

// 初始化搜索索引
await initSearch()

// 搜索项目
const results = search('vue')
```

---

## 动画组件

### ScrollReveal

滚动揭示组件，元素进入视口时触发动画。

```vue
<ScrollReveal :threshold="0.1" :delay="100" direction="up">
  <div>内容</div>
</ScrollReveal>
```

**Props:**
- `threshold`: 触发阈值 (默认 0.1)
- `delay`: 延迟毫秒 (默认 0)
- `direction`: 动画方向 up/down/left/right

### FadeIn

淡入动画组件。

```vue
<FadeIn :duration="500" :delay="100">
  <div>内容</div>
</FadeIn>
```

**Props:**
- `duration`: 动画时长毫秒 (默认 500)
- `delay`: 延迟毫秒 (默认 0)

### 页面过渡

App.vue 中已配置页面切换动画（淡入 + 轻微上移）

---

## 状态管理

### useProjectsStore

```typescript
const store = useProjectsStore()

store.projects           // 项目列表
store.loading           // 加载状态
store.loaded            // 是否已加载

store.loadProjects()    // 加载所有项目
store.getProjectBySlug('xxx') // 获取项目
store.getProjectContent('xxx', 'zh') // 获取内容
```

### useSiteStore

```typescript
const store = useSiteStore()

store.config         // 站点配置
store.locale        // 当前语言
store.theme         // 当前主题
store.isDark        // 是否暗色模式

store.setLocale('en')
store.setTheme('dark')
store.toggleTheme()
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

## 扩展性

| 需求 | 实现方式 |
|------|----------|
| 新增链接类型 | 在 meta.yml 添加字段 |
| 新增页面 | views/ 添加组件，router/ 注册 |
| 新增语言 | 内容文件加后缀 (index.zh.md) |
| 新增组件 | components/ 添加组件 |
| 自定义动画 | 项目详情页单独添加 |

---

## 部署

推荐部署到：
- **Vercel** - 自动部署
- **Netlify** - 功能丰富
- **GitHub Pages** - 免费开源

构建命令：`pnpm build`，输出在 `dist/` 目录
