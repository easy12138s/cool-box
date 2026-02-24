#!/bin/bash

# 阿里云容器镜像服务部署脚本
# 使用阿里云内置构建规则：release-v$version

set -e

# 获取脚本所在目录（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# 阿里云镜像仓库配置
REGISTRY="crpi-8ucw6aeyy72a7z1p.cn-shanghai.personal.cr.aliyuncs.com"
NAMESPACE="easy-box"
IMAGE_NAME="box1"

# 版本号（不包含 v 前缀，如输入 1 或 1.0.0）
VERSION="${1:-1}"

# 镜像标签（带 v 前缀）
TAG="v${VERSION}"

FULL_IMAGE="${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${TAG}"

echo "=== 阿里云镜像部署脚本 ==="
echo "项目目录: ${PROJECT_ROOT}"
echo "镜像地址: ${FULL_IMAGE}"
echo "版本: ${VERSION}"
echo ""

# 登录阿里云镜像仓库
echo "检查登录状态..."
if ! docker login --username=黄河边上的dj之王 ${REGISTRY} 2>/dev/null; then
    echo "请先登录阿里云镜像仓库："
    echo "docker login --username=你的用户名 ${REGISTRY}"
    exit 1
fi

# 构建镜像
echo "构建 Docker 镜像..."
docker build -t ${FULL_IMAGE} .

# 推送镜像
echo "推送镜像到阿里云..."
docker push ${FULL_IMAGE}

echo "=== 部署完成 ==="
echo ""
echo "镜像已推送到: ${FULL_IMAGE}"
echo ""
echo "在服务器上运行："
echo "docker pull ${FULL_IMAGE}"
echo "docker run -d --name cool-box -p 3000:80 ${FULL_IMAGE}"
