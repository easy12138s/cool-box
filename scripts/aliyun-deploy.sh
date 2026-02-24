#!/bin/bash

# 阿里云镜像自动部署脚本（服务器端）
# 支持手动触发和 Webhook 触发

set -e

# 配置
REGISTRY="crpi-8ucw6aeyy72a7z1p.cn-shanghai.personal.cr.aliyuncs.com"
NAMESPACE="easy-box"
IMAGE_NAME="box1"
TAG="${1:-latest}"
CONTAINER_NAME="cool-box"
PORT="${2:-3000}"

FULL_IMAGE="${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${TAG}"

echo "=== 阿里云镜像自动部署 ==="
echo "镜像: ${FULL_IMAGE}"
echo "端口: ${PORT}"
echo ""

# 登录阿里云镜像仓库（如果需要）
echo "检查登录状态..."
if ! docker info > /dev/null 2>&1; then
    docker login --username=黄河边上的dj之王 ${REGISTRY}
fi

# 停止并删除旧容器
echo "停止旧容器..."
docker stop ${CONTAINER_NAME} 2>/dev/null || true
docker rm ${CONTAINER_NAME} 2>/dev/null || true

# 拉取最新镜像
echo "拉取最新镜像..."
docker pull ${FULL_IMAGE}

# 启动新容器
echo "启动新容器..."
docker run -d \
    --name ${CONTAINER_NAME} \
    -p ${PORT}:80 \
    --restart unless-stopped \
    ${FULL_IMAGE}

echo ""
echo "=== 部署完成 ==="
echo "访问 http://你的服务器IP:${PORT}"
echo "容器状态: $(docker ps --filter name=${CONTAINER_NAME} --format '{{.Status}}')"
