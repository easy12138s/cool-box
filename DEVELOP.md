# Cool Box 开发文档

> 最后更新: 2024-06-21

## 项目状态

✅ **已完成** - 基础框架搭建
✅ **已完成** - 动态内容加载 + Markdown渲染
✅ **已完成** - 暗黑模式 + 页面动画

## 项目概述

基于 Vite + Vue 3 的静态项目展示网站，支持多语言、暗黑模式、响应式布局。

## 技术栈

- Vue 3.4.x (Composition API)
- Vite 5.x
- Vue Router 4.x
- Pinia 2.x
- UnoCSS 0.58.x
- TypeScript 5.x

## 开发规范

### 目录结构

```
src/
├── components/     # 组件
│   ├── layout/     # 布局组件 (Navbar, Footer)
│   └── project/   # 项目相关组件
├── views/          # 页面视图
├── stores/         # Pinia 状态管理
├── router/         # 路由配置
├── styles/         # 全局样式
└── types/          # 类型定义
```

### 样式规范

- 使用 UnoCSS 原子化类
- 暗色模式支持：通过 `dark:` 前缀
- 颜色变量：在 `uno.config.ts` 中定义

### 组件规范

- 使用 `<script setup lang="ts">` 语法
- 组件名使用 PascalCase
- Props 使用 TypeScript 类型定义

### 国际化

- 使用 `useSiteStore` 的 `locale` 状态
- 文本内容通过 `siteStore.locale` 切换

## Composables

### useProjects

- `projects`: 项目列表
- `fetchProjects()`: 加载所有项目
- `getProjectBySlug(slug)`: 获取单个项目
- `getProjectContent(slug, locale)`: 获取项目Markdown内容
- `getProjectHasVuePage(slug)`: 检查是否有Vue页面

### useSearch

- `initSearch()`: 初始化搜索索引
- `search(query)`: 搜索项目

## 暗黑模式

- 使用 `useSiteStore` 的 `theme` 状态
- 支持 `light` / `dark` / `auto` 三种模式
- 通过 `siteStore.toggleTheme()` 切换
- 偏好保存在 localStorage

## 动画组件

### ScrollReveal

滚动揭示组件，元素进入视口时触发动画。

```vue
<ScrollReveal :threshold="0.1" :delay="100" direction="up">
  <div>内容</div>
</ScrollReveal>
```

### FadeIn

淡入动画组件。

```vue
<FadeIn :duration="500" :delay="100">
  <div>内容</div>
</FadeIn>
```

### 页面过渡

App.vue 中已配置页面切换动画（淡入 + 轻微上移）

## 页面路由

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | Home.vue | 主页 |
| `/projects` | Projects.vue | 项目列表 |
| `/projects/:slug` | ProjectDetail.vue | 项目详情 |
| `/links` | Links.vue | 外部链接 |

## 状态管理

### useProjectsStore

- `projects`: 项目列表
- `fetchProjects()`: 加载项目
- `getProjectBySlug(slug)`: 获取单个项目

### useSiteStore

- `config`: 站点配置
- `locale`: 当前语言 ('zh' | 'en')
- `setLocale()`: 切换语言
