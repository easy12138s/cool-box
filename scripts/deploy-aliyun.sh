#!/bin/bash

# 阿里云容器镜像服务部署脚本
# 先本地构建，再构建 Docker 镜像推送到阿里云

set -e

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# 阿里云镜像仓库配置
REGISTRY="crpi-8ucw6aeyy72a7z1p.cn-shanghai.personal.cr.aliyuncs.com"
NAMESPACE="easy-box"
IMAGE_NAME="box1"

# 版本号
VERSION="${1:-1}"
TAG="v${VERSION}"

FULL_IMAGE="${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${TAG}"

echo "=== 阿里云镜像部署脚本 ==="
echo "项目目录: ${PROJECT_ROOT}"
echo "镜像地址: ${FULL_IMAGE}"
echo ""

# 1. 安装依赖并构建
echo "步骤1: 安装依赖..."
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
fi

pnpm install

echo "步骤2: 构建项目..."
pnpm build

# 检查构建产物
echo "检查构建产物..."
ls -la dist/ || echo "dist目录不存在"
ls -la nginx.conf || echo "nginx.conf不存在"

# 2. 登录阿里云镜像仓库
echo "步骤3: 登录阿里云镜像仓库..."
docker login --username=黄河边上的dj之王 ${REGISTRY}

# 3. 构建并推送 Docker 镜像
echo "步骤4: 构建 Docker 镜像..."
docker build -t ${FULL_IMAGE} .

echo "步骤5: 推送镜像到阿里云..."
docker push ${FULL_IMAGE}

echo ""
echo "=== 部署完成 ==="
echo "镜像: ${FULL_IMAGE}"
echo ""
echo "在服务器上运行："
echo "docker pull ${FULL_IMAGE}"
echo "docker run -d --name cool-box -p 3000:80 ${FULL_IMAGE}"
