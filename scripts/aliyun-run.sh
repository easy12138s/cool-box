#!/bin/bash

# 阿里云镜像部署脚本（服务器端）
# 从阿里云私有仓库拉取镜像并运行

set -e

# 阿里云镜像仓库配置
REGISTRY="crpi-8ucw6aeyy72a7z1p.cn-shanghai.personal.cr.aliyuncs.com"
NAMESPACE="easy-box"
IMAGE_NAME="box1"
TAG="${1:-latest}"

CONTAINER_NAME="cool-box"
PORT="${2:-3000}"

FULL_IMAGE="${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${TAG}"

echo "=== 阿里云镜像启动脚本 ==="
echo "镜像地址: ${FULL_IMAGE}"
echo "端口: ${PORT}"
echo ""

# 登录阿里云镜像仓库（首次需要）
echo "检查登录状态..."
if ! docker info > /dev/null 2>&1; then
    echo "请先登录阿里云镜像仓库："
    echo "docker login --username=你的用户名 ${REGISTRY}"
    exit 1
fi

# 停止并删除旧容器
echo "清理旧容器..."
docker stop ${CONTAINER_NAME} 2>/dev/null || true
docker rm ${CONTAINER_NAME} 2>/dev/null || true

# 拉取镜像
echo "拉取镜像..."
docker pull ${FULL_IMAGE}

# 运行容器
echo "启动容器..."
docker run -d \
    --name ${CONTAINER_NAME} \
    -p ${PORT}:80 \
    ${FULL_IMAGE}

echo "=== 部署完成 ==="
echo "访问 http://你的服务器IP:${PORT}"
echo ""
echo "常用命令："
echo "  查看日志: docker logs -f ${CONTAINER_NAME}"
echo "  停止容器: docker stop ${CONTAINER_NAME}"
echo "  删除容器: docker rm ${CONTAINER_NAME}"
