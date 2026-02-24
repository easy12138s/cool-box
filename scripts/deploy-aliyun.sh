#!/bin/bash

# 阿里云容器镜像服务部署脚本
# 构建并推送到阿里云私有镜像仓库

set -e

# 阿里云镜像仓库配置
REGISTRY="crpi-8ucw6aeyy72a7z1p.cn-shanghai.personal.cr.aliyuncs.com"
NAMESPACE="easy-box"
IMAGE_NAME="box1"
TAG="${1:-latest}"

FULL_IMAGE="${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${TAG}"

echo "=== 阿里云镜像部署脚本 ==="
echo "镜像地址: ${FULL_IMAGE}"

# 登录阿里云镜像仓库
echo "请先登录阿里云镜像仓库："
echo "docker login --username=你的用户名 ${REGISTRY}"
echo ""

# 构建镜像
echo "构建 Docker 镜像..."
docker build -t ${FULL_IMAGE} .

# 推送镜像
echo "推送镜像到阿里云..."
docker push ${FULL_IMAGE}

echo "=== 部署完成 ==="
echo ""
echo "在服务器上运行以下命令拉取并启动："
echo "docker pull ${FULL_IMAGE}"
echo "docker run -d -p 3000:80 ${FULL_IMAGE}"
