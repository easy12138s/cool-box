# Cool Box

基于 Vite + Vue 3 的静态项目展示网站。

## 特性

- 🌓 暗黑模式支持
- 🌐 国际化（中英文）
- 📱 响应式布局
- ⚡ 静态站点，快速加载
- 🔍 项目搜索
- 🎨 动画效果

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

## 项目结构

```
├── config/site.yml         # 全局配置
├── content/projects/      # 项目内容
├── src/
│   ├── views/            # 页面组件
│   ├── components/       # 通用组件
│   ├── composables/      # 组合式函数
│   └── stores/           # 状态管理
├── Dockerfile            # Docker 构建
├── nginx.conf           # Nginx 配置
└── docker-compose.yml   # Docker Compose
```

## 添加新项目

在 `content/projects/` 目录下创建新文件夹：

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

### 1. Docker 部署（推荐）

```bash
# 克隆项目
git clone https://github.com/easy12138s/cool-box.git
cd cool-box

# 构建并运行
docker-compose up -d --build

# 访问 http://localhost:3000
```

### 2. Docker 部署（使用国内镜像）

服务器无法访问 Docker Hub 时使用：

```bash
# 修改 Dockerfile 使用国内镜像
# 已配置 registry.cn-hangzhou.aliyuncs.com 镜像源

docker-compose up -d --build
```

### 3. 阿里云容器镜像服务部署

#### 3.1 本地构建并推送镜像

```bash
# 1. 登录阿里云镜像仓库
docker login --username=你的阿里云账号 crpi-8ucw6aeyy72a7z1p.cn-shanghai.personal.cr.aliyuncs.com

# 2. 使用脚本构建并推送
chmod +x scripts/deploy-aliyun.sh
./scripts/deploy-aliyun.sh latest
```

或手动执行：
```bash
# 构建镜像
docker build -t crpi-8ucw6aeyy72a7z1p.cn-shanghai.personal.cr.aliyuncs.com/easy-box/box1:latest .

# 推送镜像
docker push crpi-8ucw6aeyy72a7z1p.cn-shanghai.personal.cr.aliyuncs.com/easy-box/box1:latest
```

#### 3.2 服务器拉取并运行

```bash
# 1. 登录阿里云镜像仓库
docker login --username=你的阿里云账号 crpi-8ucw6aeyy72a7z1p.cn-shanghai.personal.cr.aliyuncs.com

# 2. 使用脚本启动
chmod +x scripts/aliyun-run.sh
./scripts/aliyun-run.sh latest 3000

# 或手动执行
docker pull crpi-8ucw6aeyy72a7z1p.cn-shanghai.personal.cr.aliyuncs.com/easy-box/box1:latest
docker run -d --name cool-box -p 3000:80 crpi-8ucw6aeyy72a7z1p.cn-shanghai.personal.cr.aliyuncs.com/easy-box/box1:latest
```

**镜像地址：**
- 公网：`crpi-8ucw6aeyy72a7z1p.cn-shanghai.personal.cr.aliyuncs.com/easy-box/box1`
- 专有网络：`crpi-8ucw6aeyy72a7z1p-vpc.cn-shanghai.personal.cr.aliyuncs.com/easy-box/box1`

### 4. Nginx 手动部署

```bash
# 1. 安装依赖
sudo apt install -y nginx git
npm install -g pnpm

# 2. 克隆并构建
git clone https://github.com/easy12138s/cool-box.git
cd cool-box
pnpm install
pnpm build

# 3. 部署
sudo cp -r dist/* /var/www/html/
sudo cp nginx.conf /etc/nginx/sites-available/cool-box
sudo ln -s /etc/nginx/sites-available/cool-box /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. GitHub Pages 部署

项目已配置 GitHub Actions，推送代码到 master 分支自动部署。

手动部署：
```bash
pnpm build
pnpm add -D gh-pages
gh-pages -d dist
```

### 5. Vercel 部署

```bash
pnpm add -g vercel
vercel
```

## 常用命令

```bash
# Docker
docker-compose up -d --build    # 构建并启动
docker-compose logs -f          # 查看日志
docker-compose down             # 停止服务
docker-compose restart          # 重启服务

# NPM
pnpm dev        # 开发模式
pnpm build      # 生产构建
pnpm preview    # 预览构建
```

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

## License

MIT
