#!/bin/bash

# 一键部署到阿里云服务器
# 本地运行此脚本，自动在服务器上部署

# 服务器配置
SERVER_HOST="你的服务器IP"
SERVER_USER="root"
SERVER_PORT="22"
SERVER_PATH="/root/cool-box"

# 镜像配置
REGISTRY="crpi-8ucw6aeyy72a7z1p.cn-shanghai.personal.cr.aliyuncs.com"
NAMESPACE="easy-box"
IMAGE_NAME="box1"
TAG="${1:-v1}"

FULL_IMAGE="${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${TAG}"

echo "=== 一键部署到阿里云服务器 ==="
echo "服务器: ${SERVER_USER}@${SERVER_HOST}:${SERVER_PORT}"
echo "镜像: ${FULL_IMAGE}"
echo ""

# 1. 先推送镜像到阿里云
echo "步骤1: 推送镜像到阿里云..."
./scripts/deploy-aliyun.sh ${TAG#v}

# 2. SSH 到服务器拉取并部署
echo "步骤2: 在服务器上部署..."
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
    cd ${SERVER_PATH}
    docker login --username=黄河边上的dj之王 ${REGISTRY}
    ./scripts/aliyun-deploy.sh ${TAG} 3000
"

echo ""
echo "=== 部署完成 ==="
echo "访问 http://${SERVER_HOST}:3000"
